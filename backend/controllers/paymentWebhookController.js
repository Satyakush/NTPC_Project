const crypto = require("crypto");
const Bill = require("../models/Bill");

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return res.status(400).json({ message: "Invalid webhook configuration" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (
      expectedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    ) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString("utf8"));

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;
      const orderId = paymentEntity?.order_id || orderEntity?.id;

      if (orderId) {
        const bill = await Bill.findOne({ razorpayOrderId: orderId });

        if (bill && bill.paymentStatus !== "paid") {
          bill.paymentStatus = "paid";
          bill.razorpayPaymentId = paymentEntity?.id || bill.razorpayPaymentId;
          bill.paidAt = bill.paidAt || new Date();
          bill.paymentFailureReason = "";
          await bill.save();
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error.message);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};
