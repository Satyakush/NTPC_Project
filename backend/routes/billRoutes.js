const express = require("express");
const router = express.Router();
const { getMyBills, getAllBills } = require("../controllers/billController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/mine", auth, getMyBills);
router.get("/", auth, role("cooperative"), getAllBills);

module.exports = router;
