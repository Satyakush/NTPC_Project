const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Quote", quoteSchema);
