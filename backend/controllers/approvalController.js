const Approval = require("../models/Approval");

// Approve request by role
exports.approve = async (req, res) => {
  try {
    const { request_id, role } = req.body;

    if (!["customer", "cooperative", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updateField = {};
    updateField[`${role}_approved`] = true;
    updateField.approved_at = new Date();

    const approval = await Approval.findOneAndUpdate(
      { request_id },
      { $set: updateField },
      { upsert: true, new: true }
    );

    res.json({ message: `${role} approved`, approval });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get approval status
exports.getApprovalStatus = async (req, res) => {
  try {
    const { request_id } = req.params;

    const approval = await Approval.findOne({ request_id });

    if (!approval) {
      return res.status(404).json({ message: "Approval record not found" });
    }

    res.json(approval);
  } catch (error) {
    console.error("Get Approval Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
