const Bill = require("../models/Bill");

exports.uploadBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBillByRequest = async (req, res) => {
  try {
    const bill = await Bill.findOne({ request_id: req.params.requestId });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
