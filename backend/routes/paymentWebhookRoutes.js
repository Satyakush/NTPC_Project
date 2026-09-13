const router = require("express").Router();
const { handleRazorpayWebhook } = require("../controllers/paymentWebhookController");

router.post(
  "/razorpay",
  require("express").raw({ type: "application/json" }),
  handleRazorpayWebhook
);

module.exports = router;
