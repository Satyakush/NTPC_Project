const express = require("express");
const router = express.Router();

const {
  submitQuote,
  getMyQuotes,
  getAllQuotes,
  approveQuote,
  rejectQuote,
} = require("../controllers/quoteController");

const { protect } = require("../middleware/authMiddleware");
const { isCooperative,
        isVendor,
 } = require("../middleware/roleMiddleware");

// Vendor submits quote
router.post("/:requestId", protect, isVendor, submitQuote);

// Vendor views own quotes
router.get("/mine", protect, getMyQuotes);

// Cooperative views all quotes
router.get("/all", protect, isCooperative, getAllQuotes);

// Cooperative approves a quote
router.put(
  "/approve/:id",
  protect,
  isCooperative,
  approveQuote
);

// Cooperative rejects a quote
router.put(
  "/reject/:id",
  protect,
  isCooperative,
  rejectQuote
);

module.exports = router;