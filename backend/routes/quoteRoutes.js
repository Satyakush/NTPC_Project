const express = require("express");
const router = express.Router();
const {
  submitQuote,
  getMyQuotes,
  getQuotesByRequest,
} = require("../controllers/quoteController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role("vendor"), submitQuote);
router.get("/mine", auth, role("vendor"), getMyQuotes);
router.get("/:requestId", auth, role("cooperative"), getQuotesByRequest);

module.exports = router;
