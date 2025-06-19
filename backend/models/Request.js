const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  cooperative_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cooperative",
    required: true,
  },
  item_name: { type: String, required: true },
  item_specification: { type: String },
  quantity: { type: Number },
  status: {
    type: String,
    enum: [
      "pending",
      "published",
      "quoted",
      "l1_selected",
      "finalized",
      "approved",
      "shipped",
      "completed",
    ],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

requestSchema.index({ status: 1 });

module.exports = mongoose.model("Request", requestSchema);
