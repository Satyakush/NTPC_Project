const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
    unique: true,
  },
  customer_approved: { type: Boolean, default: false },
  cooperative_approved: { type: Boolean, default: false },
  vendor_approved: { type: Boolean, default: false },
  approved_at: { type: Date },
});

module.exports = mongoose.model("Approval", approvalSchema);
