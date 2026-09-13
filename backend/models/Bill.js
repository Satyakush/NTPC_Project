const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
        required: true,
      },
    ],

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    commission: {
      type: Number,
      required: true,
      min: 0,
    },

    customerTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },

    paymentCurrency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentFailureReason: {
      type: String,
      default: "",
      trim: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

billSchema.index(
  { request: 1, vendor: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.Bill || mongoose.model("Bill", billSchema);
