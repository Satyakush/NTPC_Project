const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  related_entity_type: {
    type: String,
    enum: ["request", "quote", "bill", "shipment", "approval"],
  },
  related_entity_id: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String, required: true },
  type: { type: String, enum: ["popup", "email", "both"] },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

notificationSchema.index({ is_read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
