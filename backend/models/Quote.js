const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
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
    unit_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    is_l1: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["submitted", "rejected", "selected"],
      default: "submitted",
    },
    created_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

quoteSchema.index({ request_id: 1, vendor_id: 1 }, { unique: true });

module.exports = mongoose.model("Quote", quoteSchema);
