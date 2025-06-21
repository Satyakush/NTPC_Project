const express = require("express");
const router = express.Router();
const { getMyBills, getAllBills } = require("../controllers/billController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Get bills for the authenticated user
router.get("/mine", auth, getMyBills);

// Get all bills (accessible by cooperative role)
router.get("/", auth, role("cooperative"), getAllBills);

module.exports = router;
