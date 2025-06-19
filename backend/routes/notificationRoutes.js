const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a notification
router.post("/", authMiddleware, notificationController.createNotification);

// Get user notifications
router.get("/", authMiddleware, notificationController.getUserNotifications);

module.exports = router;
