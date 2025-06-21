const Quote = require("../models/Quote");
const Bill = require("../models/Bill");
const User = require("../models/User");
const transporter = require("../config/mailer");

exports.approveQuote = async (req, res) => {
  const { requestId } = req.body;

  const quotes = await Quote.find({ requestId }).populate("vendorId");
  if (!quotes.length)
    return res.status(404).json({ message: "No quotes found." });

  const lowest = quotes.reduce((a, b) => (a.amount < b.amount ? a : b));
  const commission = 0.1 * lowest.amount;
  const total = lowest.amount + commission;

  const customer = await User.findById(lowest.requestId.customerId);
  if (customer) {
    await transporter.sendMail({
      from: process.env.COOP_EMAIL,
      to: customer.email,
      subject: "Quote Approved",
      text: `Lowest quote approved. Total (incl. commission): ₹${total}.`,
    });
  }

  const customerBill = new Bill({
    requestId,
    vendorId: lowest.vendorId._id,
    customerId: lowest.requestId.customerId,
    amount: lowest.amount,
    commission,
    totalAmount: total,
    gstNumber: process.env.COOPERATIVE_GST_NUMBER,
  });

  const vendorBill = new Bill({
    requestId,
    vendorId: lowest.vendorId._id,
    customerId: lowest.requestId.customerId,
    amount: lowest.amount,
    commission: 0,
    totalAmount: lowest.amount,
    gstNumber: lowest.vendorId.gstNumber,
  });

  await customerBill.save();
  await vendorBill.save();

  res.json({ message: "Quote approved. Bills generated." });
};
