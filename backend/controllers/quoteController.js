const Quote = require("../models/Quote");

exports.submitQuote = async (req, res) => {
  try {
    const { request_id, unit_price, total_price } = req.body;

    const newQuote = await Quote.create({
      request_id,
      vendor_id: req.user.id,
      unit_price,
      total_price,
    });

    const allQuotes = await Quote.find({ request_id });

    const lowestQuote = allQuotes.reduce(
      (min, q) => (q.total_price < min.total_price ? q : min),
      allQuotes[0]
    );

    await Promise.all(
      allQuotes.map((q) =>
        Quote.findOneAndUpdate(
          { request_id: q.request_id, vendor_id: q.vendor_id },
          { is_l1: q._id.toString() === lowestQuote._id.toString() }
        )
      )
    );

    res.status(201).json({
      message: "Quote submitted successfully",
      quote: newQuote,
      l1_quote: lowestQuote,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit quote" });
  }
};

exports.getVendorQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ vendor_id: req.user.id });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor quotes" });
  }
};

exports.getRequestQuotes = async (req, res) => {
  try {
    const { request_id } = req.params;
    const quotes = await Quote.find({ request_id });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch request quotes" });
  }
};

exports.getL1Quote = async (req, res) => {
  try {
    const { request_id } = req.params;
    const l1Quote = await Quote.findOne({ request_id, is_l1: true });
    res.json(l1Quote);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch L1 quote" });
  }
};
