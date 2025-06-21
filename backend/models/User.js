const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  organization: String,
  address: String,
  gstNumber: String,
  password: String,
  isVendor: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["customer", "vendor", "cooperative"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
