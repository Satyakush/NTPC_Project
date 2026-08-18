const Bill = require("../models/Bill");

// Customer: get only their bills
exports.getCustomerBills = async (req, res) => {
  try {
    const bills = await Bill.find({ customer: req.user.id })
      .populate("request", "requestId")
      .populate("vendor", "name organization")
      .select("-commission")
      .sort({ generatedAt: -1 });

    res.json(bills);
  } catch (err) {
    console.error("❌ Error fetching customer bills:", err);
    res.status(500).json({
      message: "Error fetching customer bills",
    });
  }
};

// Vendor: get only bills belonging to them
exports.getVendorBills = async (req, res) => {
  try {
    const bills = await Bill.find({ vendor: req.user.id })
      .populate("request", "requestId")
      .populate("customer", "name email")
      .select("-commission")
      .sort({ generatedAt: -1 });

    res.json(bills);
  } catch (err) {
    console.error("❌ Error fetching vendor bills:", err);
    res.status(500).json({
      message: "Error fetching vendor bills",
    });
  }
};

// Cooperative: get all bills
// Commission is visible only here
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("request", "requestId")
      .populate("customer", "name email")
      .populate("vendor", "name email organization gstin")
      .sort({ generatedAt: -1 });

    res.json(bills);
  } catch (err) {
    console.error("❌ Error fetching all bills:", err);
    res.status(500).json({
      message: "Error fetching all bills",
    });
  }
};