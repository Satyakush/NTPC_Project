const mongoose = require("mongoose");
const User = require("../models/User");
const Request = require("../models/Request");
const generateRequestId = require("../utils/generateRequestId");
const transporter = require("../config/mailer");
const VendorItem = require("../models/VendorItem");
const Quote = require("../models/Quote");
const Bill = require("../models/Bill");

exports.createRequest = async (req, res) => {
  try {
    const { items, remarks, isDraft } = req.body;
    const customerId = req.user.id;

    const reqCount = await Request.countDocuments();
    const requestId = generateRequestId(reqCount + 1);

    const newRequest = await Request.create({
      requestId,
      customer: customerId,
      items,
      remarks,
      status: isDraft ? "draft" : "pending",
    });

    if (!isDraft) {
      await transporter.sendMail({
        to: process.env.COOP_EMAIL,
        subject: "📢 New Request Pending Review",
        html: `<p>Request ID: ${requestId}</p><p>Customer: ${req.user.email}</p>`,
      });
    }

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ message: "Error creating request" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

exports.getVendorItems = async (req, res) => {
  try {
    const items = await VendorItem.find().distinct("name");
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching vendor items:", err);
    res.status(500).json({ message: "Failed to load vendor items" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching all requests:", err);
    res.status(500).json({ message: "Error fetching all requests" });
  }
};

exports.getPublishedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "published" }).populate(
      "customer"
    );

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching published requests:", err);
    res.status(500).json({ message: "Error fetching published requests" });
  }
};

exports.publishRequest = async (req, res) => {
  try {
    if (req.user.role !== "cooperative") {
      return res
        .status(403)
        .json({ message: "Only cooperative can publish requests" });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    ).populate("customer");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const vendors = await User.find({ role: "vendor" });

    for (let vendor of vendors) {
      await transporter.sendMail({
        to: vendor.email,
        subject: "📢 New Request Available",
        html: `<p>Hello Vendor,</p>
               <p>A new request (<strong>${request.requestId}</strong>) has been published.</p>
               <p>Customer: ${request.customer.email}</p>`,
      });
    }

    res.json(request);
  } catch (err) {
    console.error("❌ Error publishing request:", err);
    res.status(500).json({ message: "Failed to publish request" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("customer");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error("❌ Error fetching request by ID:", err);
    res.status(500).json({ message: "Error fetching request" });
  }
};

exports.finalizeRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (req.user.role !== "cooperative") {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        message: "Only cooperative can finalize requests",
      });
    }

    const request = await Request.findById(req.params.id).session(session);

    if (!request) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status === "billed") {
      await session.abortTransaction();
      session.endSession();

      return res.status(409).json({
        message: "This request has already been finalized and billed",
      });
    }

    if (request.status !== "published") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Only published requests can be finalized",
      });
    }

    const approvedQuotes = await Quote.find({
      request: request._id,
      status: "approved",
    }).session(session);

    const requestItemNames = new Set(
      request.items.map((item) => item.name.trim().toLowerCase())
    );

    const invalidQuotes = approvedQuotes.filter(
      (quote) =>
        !requestItemNames.has(quote.item.name.trim().toLowerCase())
    );

    if (invalidQuotes.length > 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "One or more approved quotes contain invalid request items",
      });
    }

    if (approvedQuotes.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "No approved quotes available for this request",
      });
    }

    const approvedItemNames = new Set();

    for (const quote of approvedQuotes) {
      const itemName = quote.item.name.trim().toLowerCase();

      if (approvedItemNames.has(itemName)) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `Multiple approved quotes found for item: ${quote.item.name}`,
        });
      }

      approvedItemNames.add(itemName);
    }

    const missingItems = request.items.filter(
      (item) =>
        !approvedItemNames.has(item.name.trim().toLowerCase())
    );

    if (missingItems.length > 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Not all requested items have an approved quote",
        missingItems: missingItems.map((item) => item.name),
      });
    }

    const groupedByVendor = approvedQuotes.reduce((groups, quote) => {
      const vendorId = quote.vendor.toString();

      if (!groups[vendorId]) {
        groups[vendorId] = [];
      }

      groups[vendorId].push(quote);

      return groups;
    }, {});

    const bills = [];

    for (const vendorId of Object.keys(groupedByVendor)) {
      const vendorQuotes = groupedByVendor[vendorId];

      let vendorAmount = 0;

      for (const quote of vendorQuotes) {
        const requestItem = request.items.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            quote.item.name.trim().toLowerCase()
        );

        if (!requestItem) {
          await session.abortTransaction();
          session.endSession();

          return res.status(400).json({
            message: `Request item not found for quote: ${quote.item.name}`,
          });
        }

        vendorAmount += quote.price * requestItem.quantity;
      }

      const commission = vendorAmount * 0.08;

      const customerTotal = vendorAmount + commission;

      const bill = await Bill.create(
        [
          {
            quotes: vendorQuotes.map((quote) => quote._id),
            request: request._id,
            customer: request.customer,
            vendor: vendorId,
            vendorAmount,
            commission,
            customerTotal,
          },
        ],
        { session }
      );

      bills.push(bill[0]);
    }

    request.status = "billed";

    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Request finalized and bills generated",
      bills,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Error finalizing request:", err);

    res.status(500).json({
      message: "Failed to finalize request",
    });
  }
};