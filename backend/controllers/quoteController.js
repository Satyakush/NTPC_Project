const Quote = require("../models/Quote");
const transporter = require("../config/mailer");

exports.submitQuote = async (req, res) => {
  const { requestId, amount } = req.body;
  const vendorId = req.user._id;

  try {
    const newQuote = new Quote({ requestId, vendorId, amount });
    await newQuote.save();

    await transporter.sendMail({
      from: process.env.COOP_EMAIL,
      to: req.user.email,
      subject: "Quote Submitted",
      text: `Quote for request ${requestId} submitted.`,
    });

    res.status(201).json(newQuote);
  } catch (error) {
    console.error("Error submitting quote:", error);
    res.status(500).json({ message: "Server error while submitting quote" });
  }
};

exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ vendorId: req.user._id }).populate(
      "requestId"
    );
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching my quotes:", error);
    res.status(500).json({ message: "Server error while fetching quotes" });
  }
};

exports.getQuotesByRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const quotes = await Quote.find({ requestId }).populate(
      "vendorId",
      "name email"
    );
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes by request:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching quotes by request" });
  }
};
