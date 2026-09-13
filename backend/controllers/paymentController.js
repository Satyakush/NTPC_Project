const crypto = require("crypto");
const Bill = require("../models/Bill");
const getRazorpay = require("../config/razorpay");

const markBillPaid = async (bill, paymentId = null, signature = null) => {
  bill.paymentStatus = "paid";
  if (paymentId) {
    bill.razorpayPaymentId = paymentId;
  }
  if (signature) {
    bill.razorpaySignature = signature;
  }
  bill.paymentFailureReason = "";
  bill.paidAt = bill.paidAt || new Date();
  await bill.save();
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.billId,
      customer: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.paymentStatus === "paid") {
      return res.status(400).json({ message: "Bill is already paid" });
    }

    const razorpay = getRazorpay();
    let order;

    if (bill.razorpayOrderId) {
      try {
        order = await razorpay.orders.fetch(bill.razorpayOrderId);

        if (order.status === "paid") {
          const payments = await razorpay.orders.fetchPayments(bill.razorpayOrderId);
          const capturedPayment = payments.items?.find(
            (payment) =>
              payment.status === "captured" &&
              payment.amount === Math.round(bill.customerTotal * 100) &&
              payment.currency === bill.paymentCurrency
          );

          if (capturedPayment) {
            await markBillPaid(bill, capturedPayment.id);
            return res.json({
              message: "Payment already completed",
              paid: true,
              billId: bill._id,
            });
          }
        }
      } catch (error) {
        bill.razorpayOrderId = null;
        await bill.save();
      }
    }

    if (!order || order.status === "paid") {
      order = await razorpay.orders.create({
        amount: Math.round(bill.customerTotal * 100),
        currency: bill.paymentCurrency,
        receipt: `bill_${bill._id}`,
        notes: {
          billId: bill._id.toString(),
          requestId: bill.request.toString(),
        },
      });

      bill.razorpayOrderId = order.id;
      bill.paymentStatus = "pending";
      bill.paymentFailureReason = "";
      await bill.save();
    }

    return res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      billId: bill._id,
    });
  } catch (error) {
    console.error("Error creating payment order:", error.message);
    return res.status(500).json({ message: "Unable to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Incomplete payment details" });
    }

    const bill = await Bill.findOne({
      _id: req.params.billId,
      customer: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.paymentStatus === "paid") {
      return res.json({ message: "Payment already verified", bill });
    }

    if (bill.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ message: "Invalid payment order" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpaySignature);
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      bill.paymentStatus = "failed";
      bill.paymentFailureReason = "Payment signature verification failed";
      await bill.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const razorpay = getRazorpay();
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (
      payment.order_id !== bill.razorpayOrderId ||
      payment.amount !== Math.round(bill.customerTotal * 100) ||
      payment.currency !== bill.paymentCurrency ||
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        message: "Payment could not be confirmed as captured",
      });
    }

    await markBillPaid(bill, razorpayPaymentId, razorpaySignature);

    return res.json({
      message: "Payment verified successfully",
      bill,
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    return res.status(500).json({ message: "Unable to verify payment" });
  }
};