const express = require("express");
const router = express.Router();
const { approveQuote } = require("../controllers/approvalController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role("cooperative"), approveQuote);

module.exports = router;
