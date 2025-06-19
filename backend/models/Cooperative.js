const mongoose = require("mongoose");

const cooperativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("cooperative", cooperativeSchema);
