const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    shipped: { type: Boolean, default: false },
    shipped_at: { type: Date },
    tracking_number: { type: String },
  },
  { _id: false }
);

shipmentSchema.index({ request_id: 1, vendor_id: 1 }, { unique: true });

module.exports = mongoose.model("Shipment", shipmentSchema);
