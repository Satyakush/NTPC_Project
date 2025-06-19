const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit a quote
router.post("/", authMiddleware, quoteController.submitQuote);

// Vendor's submitted quotes
router.get("/vendor", authMiddleware, quoteController.getVendorQuotes);

// All quotes for a request
router.get(
  "/request/:request_id",
  authMiddleware,
  quoteController.getRequestQuotes
);

// Get L1 quote for a request
router.get("/l1/:request_id", authMiddleware, quoteController.getL1Quote);

module.exports = router;
