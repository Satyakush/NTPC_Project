const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
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
    vendor_bill_url: { type: String },
    final_bill_url: { type: String },
    margin_amount: { type: Number },
    total_with_margin: { type: Number },
    bill_image_url: { type: String },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

billSchema.index({ request_id: 1, vendor_id: 1 }, { unique: true });

module.exports = mongoose.model("Bill", billSchema);
