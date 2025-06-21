const express = require("express");
const router = express.Router();
const {
  register,
  login,
  approveUser,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/approve", auth, role("cooperative"), approveUser);

module.exports = router;
