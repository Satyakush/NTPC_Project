const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  commission: Number,
  totalAmount: Number,
  gstNumber: String,
});

module.exports = mongoose.model("Bill", billSchema);
