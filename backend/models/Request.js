const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User " },
  items: [String],
  requestId: { type: String, unique: true },
  isPublished: { type: Boolean, default: false },
});
module.exports = mongoose.model("Request", requestSchema);
