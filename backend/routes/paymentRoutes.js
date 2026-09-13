const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/bills/:billId/order", protect, createPaymentOrder);
router.post("/bills/:billId/verify", protect, verifyPayment);

module.exports = router;
