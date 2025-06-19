const Notification = require("../models/Notification");

exports.createNotification = async (req, res) => {
  const { user_id, related_entity_type, related_entity_id, message, type } =
    req.body;

  const note = await Notification.create({
    user_id,
    related_entity_type,
    related_entity_id,
    message,
    type,
  });

  res.status(201).json(note);
};

exports.getUserNotifications = async (req, res) => {
  const notes = await Notification.find({ user_id: req.user.id });
  res.json(notes);
};
