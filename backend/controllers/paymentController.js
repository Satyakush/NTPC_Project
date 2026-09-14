const crypto = require("crypto");
const Bill = require("../models/Bill");
const getRazorpay = require("../config/razorpay");

const MAX_PAYMENT_AMOUNT = 100000;

const getAmountPaid = (bill) => Math.max(0, Number(bill.amountPaid || 0));

const getRemainingAmount = (bill) =>
  Math.max(0, Number(bill.customerTotal || 0) - getAmountPaid(bill));

const markBillPayment = async (bill, amount, paymentId = null, signature = null) => {
  const currentPaid = getAmountPaid(bill);
  const total = Number(bill.customerTotal || 0);
  const nextPaid = Math.min(total, currentPaid + Number(amount || 0));

  bill.amountPaid = nextPaid;

  if (paymentId) {
    bill.razorpayPaymentId = paymentId;
    if (!bill.razorpayPaymentIds.includes(paymentId)) {
      bill.razorpayPaymentIds.push(paymentId);
    }
  }

  if (signature) {
    bill.razorpaySignature = signature;
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

    const remainingAmount = getRemainingAmount(bill);

    if (remainingAmount <= 0) {
      bill.paymentStatus = "paid";
      bill.paidAt = bill.paidAt || new Date();
      await bill.save();
      return res.json({
        message: "Payment already completed",
        paid: true,
        billId: bill._id,
      });
    }

    const paymentAmount = Math.min(remainingAmount, MAX_PAYMENT_AMOUNT);
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
              payment.amount === Number(order.amount) &&
              payment.currency === bill.paymentCurrency &&
              !bill.razorpayPaymentIds.includes(payment.id)
          );

          if (capturedPayment) {
            await markBillPayment(
              bill,
              capturedPayment.amount / 100,
              capturedPayment.id
            );

            return res.json({
              message:
                bill.paymentStatus === "paid"
                  ? "Payment completed"
                  : "Payment received. Continue with the remaining balance.",
              paid: bill.paymentStatus === "paid",
              billId: bill._id,
              amountPaid: bill.amountPaid,
              remainingAmount: getRemainingAmount(bill),
            });
          }
        }
      } catch (error) {
        bill.razorpayOrderId = null;
        await bill.save();
      }
    }

    if (!order || order.status === "paid" || Number(order.amount) !== Math.round(paymentAmount * 100)) {
      order = await razorpay.orders.create({
        amount: Math.round(paymentAmount * 100),
        currency: bill.paymentCurrency,
        receipt: `bill_${bill._id}_${Date.now()}`,
        notes: {
          billId: bill._id.toString(),
          requestId: bill.request.toString(),
          installmentAmount: paymentAmount.toString(),
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
      amountPaid: getAmountPaid(bill),
      totalAmount: Number(bill.customerTotal),
      remainingAmount: getRemainingAmount(bill),
      installmentAmount: Number(order.amount) / 100,
    });
  } catch (error) {
    console.error("Error creating payment order:", error.message);
    return res.status(500).json({
      message: error.message || "Unable to create payment order",
    });
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

    if (bill.razorpayPaymentIds.includes(razorpayPaymentId)) {
      return res.json({
        message: "Payment already recorded",
        bill,
      });
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
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const razorpay = getRazorpay();
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    const paymentAmount = Number(payment.amount || 0) / 100;

    if (
      payment.order_id !== bill.razorpayOrderId ||
      payment.currency !== bill.paymentCurrency ||
      payment.status !== "captured" ||
      paymentAmount <= 0 ||
      paymentAmount > getRemainingAmount(bill) ||
      paymentAmount > MAX_PAYMENT_AMOUNT
    ) {
      return res.status(400).json({
        message: "Payment could not be confirmed as captured",
      });
    }

    await markBillPayment(
      bill,
      paymentAmount,
      razorpayPaymentId,
      razorpaySignature
    );

    return res.json({
      message:
        bill.paymentStatus === "paid"
          ? "Payment completed successfully"
          : "Payment received. The remaining balance can be paid next.",
      bill,
      amountPaid: bill.amountPaid,
      remainingAmount: getRemainingAmount(bill),
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    return res.status(500).json({ message: "Unable to verify payment" });
  }
};
