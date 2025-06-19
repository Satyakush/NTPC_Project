const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approvalController");
const authMiddleware = require("../middleware/authMiddleware");

// Approve a request
router.post("/", authMiddleware, approvalController.approve);

// Get approval status by request ID
router.get(
  "/:request_id",
  authMiddleware,
  approvalController.getApprovalStatus
);

module.exports = router;
