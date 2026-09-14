const crypto = require("crypto");
const Bill = require("../models/Bill");
const PaymentEvent = require("../models/PaymentEvent");

const getAmountPaid = (bill) => Math.max(0, Number(bill.amountPaid || 0));

const markBillPayment = async (bill, amount, paymentId = null) => {
  const total = Number(bill.customerTotal || 0);
  const nextPaid = Math.min(total, getAmountPaid(bill) + Number(amount || 0));

  bill.amountPaid = nextPaid;

  if (paymentId) {
    bill.razorpayPaymentId = paymentId;
    if (!bill.razorpayPaymentIds.includes(paymentId)) {
      bill.razorpayPaymentIds.push(paymentId);
    }
  }

  bill.paymentFailureReason = "";

  if (nextPaid >= total) {
    bill.paymentStatus = "paid";
    bill.paidAt = bill.paidAt || new Date();
  } else {
    bill.paymentStatus = "pending";
    bill.paidAt = null;
  }

  await bill.save();
};

const processCapturedPayment = async (payment) => {
  const orderId = payment?.order_id;

  if (!orderId || payment?.status !== "captured") {
    return;
  }

  const bill = await Bill.findOne({ razorpayOrderId: orderId });

  if (!bill || payment.currency !== bill.paymentCurrency) {
    return;
  }

  if (bill.razorpayPaymentIds.includes(payment.id)) {
    return;
  }

  const paymentAmount = Number(payment.amount || 0) / 100;
  const remainingAmount = Math.max(
    0,
    Number(bill.customerTotal || 0) - getAmountPaid(bill)
  );

  if (paymentAmount <= 0 || paymentAmount > remainingAmount) {
    return;
  }

  await markBillPayment(bill, paymentAmount, payment.id);
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
      await processCapturedPayment(event.payload?.payment?.entity);
    }

    if (event.event === "order.paid") {
      await processCapturedPayment(event.payload?.payment?.entity);
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
