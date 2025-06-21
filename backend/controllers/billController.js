const Bill = require("../models/Bill");

exports.getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({
      $or: [{ customerId: req.user._id }, { vendorId: req.user._id }],
    }).populate("requestId");
    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error while fetching bills" });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { requestId: { $regex: search, $options: "i" } }
      : {};
    const bills = await Bill.find(filter)
      .populate("customerId", "name email")
      .populate("vendorId", "name email");
    res.json(bills);
  } catch (error) {
    console.error("Error fetching all bills:", error);
    res.status(500).json({ message: "Server error while fetching all bills" });
  }
};
