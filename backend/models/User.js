const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  organization: String,
  address: String,
  gstNumber: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ["customer", "vendor", "cooperative"],
  },
  isVendor: Boolean,
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User ", userSchema);
