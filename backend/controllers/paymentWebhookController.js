const crypto = require("crypto");
const Bill = require("../models/Bill");
const PaymentEvent = require("../models/PaymentEvent");

const markBillPaid = async (bill, paymentId = null) => {
  bill.paymentStatus = "paid";
  if (paymentId) {
    bill.razorpayPaymentId = paymentId;
  }
  bill.paymentFailureReason = "";
  bill.paidAt = bill.paidAt || new Date();
  await bill.save();
};

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret || !Buffer.isBuffer(req.body)) {
      return res.status(400).json({ message: "Invalid webhook request" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(signature);
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString("utf8"));

    if (eventId) {
      try {
        await PaymentEvent.create({
          eventId,
          event: event.event || "unknown",
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.json({ received: true, duplicate: true });
        }
        throw error;
      }
    }

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;

      if (orderId && payment?.status === "captured") {
        const bill = await Bill.findOne({ razorpayOrderId: orderId });

        if (
          bill &&
          payment.amount === Math.round(bill.customerTotal * 100) &&
          payment.currency === bill.paymentCurrency &&
          bill.paymentStatus !== "paid"
        ) {
          await markBillPaid(bill, payment.id);
        }
      }
    }

    if (event.event === "order.paid") {
      const order = event.payload?.order?.entity;
      const payment = event.payload?.payment?.entity;
      const orderId = order?.id;

      if (orderId) {
        const bill = await Bill.findOne({ razorpayOrderId: orderId });

        if (
          bill &&
          (!order.amount || order.amount === Math.round(bill.customerTotal * 100)) &&
          (!order.currency || order.currency === bill.paymentCurrency) &&
          bill.paymentStatus !== "paid"
        ) {
          await markBillPaid(bill, payment?.id || null);
        }
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;

      if (orderId) {
        const bill = await Bill.findOne({ razorpayOrderId: orderId });

        if (bill && bill.paymentStatus !== "paid") {
          bill.paymentStatus = "failed";
          bill.paymentFailureReason =
            payment?.error_description || payment?.error_reason || "Payment failed";
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