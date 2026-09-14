const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    requestId: {
      type: String,
      required: true,
    },
    submissionKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    item: {
      name: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    remark: {
      type: String,
      default: "",
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
