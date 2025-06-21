const Quote = require("../models/Quote");
const transporter = require("../config/mailer");

exports.submitQuote = async (req, res) => {
  const { requestId, amount } = req.body;
  const vendorId = req.user._id;

  const newQuote = new Quote({ requestId, vendorId, amount });
  await newQuote.save();

  await transporter.sendMail({
    from: process.env.COOP_EMAIL,
    to: req.user.email,
    subject: "Quote Submitted",
    text: `Quote for request ${requestId} submitted.`,
  });

  res.status(201).json(newQuote);
};

exports.getMyQuotes = async (req, res) => {
  const quotes = await Quote.find({ vendorId: req.user._id }).populate(
    "requestId"
  );
  res.json(quotes);
};

exports.getQuotesByRequest = async (req, res) => {
  const { requestId } = req.params;
  const quotes = await Quote.find({ requestId }).populate(
    "vendorId",
    "name email"
  );
  res.json(quotes);
};
