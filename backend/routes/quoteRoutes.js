const express = require("express");
const router = express.Router();
const {
  submitQuote,
  getMyQuotes,
  getQuotesByRequest,
} = require("../controllers/quoteController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Submit a new quote (accessible by vendor role)
router.post("/", auth, role("vendor"), submitQuote);

// Get quotes submitted by the authenticated vendor
router.get("/mine", auth, role("vendor"), getMyQuotes);

// Get quotes for a specific request (accessible by cooperative role)
router.get("/:requestId", auth, role("cooperative"), getQuotesByRequest);

module.exports = router;
