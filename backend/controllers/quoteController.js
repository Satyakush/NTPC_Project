const Quote = require("../models/Quote");
const Request = require("../models/Request");
const transporter = require("../config/mailer");

// Submit a quote for a request item
exports.submitQuote = async (req, res) => {
  try {
    const { itemName, price, remark } = req.body;
    const { requestId } = req.params;
    const vendorId = req.user.id;

    if (!itemName || itemName.trim() === "") {
      return res.status(400).json({
        message: "Item name is required.",
      });
    }

    if (price === undefined || price === null || price === "") {
      return res.status(400).json({
        message: "Price is required.",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0.",
      });
    }

    const request = await Request.findOne({ requestId });

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.status !== "published") {
      return res.status(400).json({
        message: "Quotes can only be submitted for published requests.",
      });
    }

    const normalizedItemName = itemName.trim().toLowerCase();

    const requestItem = request.items.find(
      (item) =>
        item.name.trim().toLowerCase() === normalizedItemName
    );

    if (!requestItem) {
      return res.status(400).json({
        message: "This item is not part of the requested items.",
      });
    }

    const alreadyQuoted = await Quote.findOne({
      request: request._id,
      vendor: vendorId,
      "item.name": requestItem.name,
    });

    if (alreadyQuoted) {
      return res.status(409).json({
        message: "Quote already submitted for this item.",
      });
    }

    const quote = await Quote.create({
      request: request._id,
      requestId: request.requestId,
      item: {
        name: requestItem.name,
      },
      price: numericPrice,
      remark: remark?.trim() || "",
      vendor: vendorId,
      status: "pending",
    });

    await transporter.sendMail({
      to: process.env.COOP_EMAIL,
      subject: "💰 New Quote Submitted",
      html: `
        <p><strong>Request ID:</strong> ${request.requestId}</p>
        <p><strong>Item:</strong> ${requestItem.name}</p>
        <p><strong>Price:</strong> ₹${numericPrice}</p>
        <p><strong>Vendor:</strong> ${req.user.email}</p>
      `,
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error("❌ Error in submitQuote:", err);

    res.status(500).json({
      message: "Error submitting quote.",
    });
  }
};

// Get all quotes submitted by current vendor
exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ vendor: req.user.id })
      .populate("request", "requestId")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    console.error("❌ Error fetching vendor quotes:", err);

    res.status(500).json({
      message: "Error fetching your quotes.",
    });
  }
};


// Get all quotes received for the current customer
exports.getReceivedQuotes = async (req, res) => {
  try {
    const requests = await Request.find({
      customer: req.user.id,
    }).select("_id");

    const requestIds = requests.map((request) => request._id);

    const quotes = await Quote.find({
      request: { $in: requestIds },
    })
      .populate("vendor", "name email organization gstin")
      .populate("request", "requestId")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    console.error("❌ Error fetching received quotes:", err);

    res.status(500).json({
      message: "Error fetching received quotes.",
    });
  }
};


// Get all quotes for cooperative/admin
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate("vendor", "name email")
      .populate("request", "requestId items")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    console.error("❌ Error in getAllQuotes:", err);

    res.status(500).json({
      message: "Error fetching all quotes.",
    });
  }
};

// Approve a quote
// Approve a quote
exports.approveQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found.",
      });
    }

    if (quote.status === "approved") {
      return res.status(409).json({
        message: "This quote is already approved.",
      });
    }

    // Reject any previously approved quote
    // for the same request and same item.
    await Quote.updateMany(
      {
        request: quote.request,
        "item.name": quote.item.name,
        status: "approved",
        _id: { $ne: quote._id },
      },
      {
        $set: { status: "rejected" },
      }
    );

    quote.status = "approved";
    await quote.save();

    res.json(quote);
  } catch (err) {
    console.error("❌ Error approving quote:", err);

    res.status(500).json({
      message: "Error approving quote.",
    });
  }
};

// Reject a quote
// Reject a quote
exports.rejectQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found.",
      });
    }

    if (quote.status === "approved") {
      return res.status(400).json({
        message:
          "An approved quote cannot be rejected. Approve another quote for this item to replace it.",
      });
    }

    if (quote.status === "rejected") {
      return res.status(409).json({
        message: "This quote is already rejected.",
      });
    }

    quote.status = "rejected";
    await quote.save();

    res.json(quote);
  } catch (err) {
    console.error("❌ Error rejecting quote:", err);

    res.status(500).json({
      message: "Error rejecting quote.",
    });
  }
};