// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  approveUser,
  getPendingUsers,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/approve", auth, role("cooperative"), approveUser); // Approve user route
router.get("/pending", auth, role("cooperative"), getPendingUsers); // Get pending users route

module.exports = router;
