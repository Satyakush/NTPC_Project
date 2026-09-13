const crypto = require("crypto");
const Bill = require("../models/Bill");
const getRazorpay = require("../config/razorpay");

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
      } catch (error) {
        bill.razorpayOrderId = null;
      }
    }

    if (!order) {
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

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!signaturesMatch) {
      bill.paymentStatus = "failed";
      bill.paymentFailureReason = "Payment signature verification failed";
      await bill.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    bill.paymentStatus = "paid";
    bill.razorpayPaymentId = razorpayPaymentId;
    bill.razorpaySignature = razorpaySignature;
    bill.paymentFailureReason = "";
    bill.paidAt = new Date();
    await bill.save();

    return res.json({
      message: "Payment verified successfully",
      bill,
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    return res.status(500).json({ message: "Unable to verify payment" });
  }
};
