const Request = require("../models/Request");
const User = require("../models/User");
const transporter = require("../config/mailer");

exports.createRequest = async (req, res) => {
  const { items } = req.body;
  const customerId = req.user._id;
  const email = req.user.email;

  const count = await Request.countDocuments();
  const date = new Date();
  const reqId = `${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}${String(count + 1).padStart(3, "0")}${Math.floor(
    Math.random() * 90 + 10
  )}`;

  const request = new Request({ customerId, items, requestId: reqId });
  await request.save();

  await transporter.sendMail({
    from: process.env.COOP_EMAIL,
    to: email,
    subject: "Request Created",
    text: `Your request with ID ${reqId} was created.`,
  });

  res.status(201).json(request);
};

exports.publishRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await Request.findOne({ requestId });
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.isPublished = true;
  await request.save();

  const vendors = await User.find({ role: "vendor", isApproved: true }).select(
    "email"
  );
  vendors.forEach((vendor) => {
    transporter.sendMail({
      from: process.env.COOP_EMAIL,
      to: vendor.email,
      subject: "New Request Published",
      text: `New request ${requestId} is published.`,
    });
  });

  res.json({ message: "Request published." });
};

exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ customerId: req.user._id });
  res.json(requests);
};

exports.getAllRequests = async (req, res) => {
  const { search } = req.query;
  const filter = search ? { requestId: { $regex: search, $options: "i" } } : {};
  const requests = await Request.find(filter).populate(
    "customerId",
    "name email"
  );
  res.json(requests);
};
