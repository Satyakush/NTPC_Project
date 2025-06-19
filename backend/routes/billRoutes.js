const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");
const authMiddleware = require("../middleware/authMiddleware");

// Upload a bill
router.post("/", authMiddleware, billController.uploadBill);

// Get bill by request ID
router.get("/:requestId", authMiddleware, billController.getBillByRequest);

module.exports = router;
