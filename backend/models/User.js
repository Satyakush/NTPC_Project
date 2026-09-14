const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  registrationKey: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  password: String,
  role: { type: String, enum: ["customer", "vendor", "cooperative"] },
  isApproved: { type: Boolean, default: false },
  organization: String,
  gstin: String,
  note: String,
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
