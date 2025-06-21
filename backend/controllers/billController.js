const Bill = require("../models/Bill");

exports.getMyBills = async (req, res) => {
  const bills = await Bill.find({
    $or: [{ customerId: req.user._id }, { vendorId: req.user._id }],
  }).populate("requestId");
  res.json(bills);
};

exports.getAllBills = async (req, res) => {
  const { search } = req.query;
  const filter = search ? { requestId: { $regex: search, $options: "i" } } : {};
  const bills = await Bill.find(filter)
    .populate("customerId", "name email")
    .populate("vendorId", "name email");
  res.json(bills);
};
