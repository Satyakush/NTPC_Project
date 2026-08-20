const Request = require("../models/Request");
const Quote = require("../models/Quote");
const Bill = require("../models/Bill");
const User = require("../models/User");

exports.adminStats = async (req, res) => {
  try {
    const [
      totalRequests,
      totalQuotes,
      totalBills,
      pendingUsers,
      pendingRequests,
      pendingQuotes,
      requests,
      bills,
    ] = await Promise.all([
      Request.countDocuments(),
      Quote.countDocuments(),
      Bill.countDocuments(),
      User.countDocuments({ isApproved: false }),
      Request.countDocuments({ status: "pending" }),
      Quote.countDocuments({ status: "pending" }),
      Request.find()
        .populate("customer", "name email")
        .sort({ createdAt: -1 }),
      Bill.find()
        .populate("vendor", "name email")
        .lean(),
    ]);

    // Total money generated through completed bills
    const totalProcurementValue = bills.reduce(
      (sum, bill) => sum + (bill.customerTotal || 0),
      0
    );

    // Total cooperative commission
    const totalCommission = bills.reduce(
      (sum, bill) => sum + (bill.commission || 0),
      0
    );

    // Group quotes by request
    const quotes = await Quote.find().lean();

    const quotesByRequest = {};

    for (const quote of quotes) {
      const requestId = quote.request.toString();

      if (!quotesByRequest[requestId]) {
        quotesByRequest[requestId] = {
          received: 0,
          approved: 0,
        };
      }

      quotesByRequest[requestId].received++;

      if (quote.status === "approved") {
        quotesByRequest[requestId].approved++;
      }
    }

    // Group bills by request
    const billsByRequest = {};

    for (const bill of bills) {
      const requestId = bill.request.toString();

      if (!billsByRequest[requestId]) {
        billsByRequest[requestId] = {
          count: 0,
          vendors: [],
          customerTotal: 0,
          commission: 0,
        };
      }

      billsByRequest[requestId].count++;

      if (bill.vendor) {
        billsByRequest[requestId].vendors.push({
          id: bill.vendor._id,
          name: bill.vendor.name,
          email: bill.vendor.email,
        });
      }

      billsByRequest[requestId].customerTotal +=
        bill.customerTotal || 0;

      billsByRequest[requestId].commission +=
        bill.commission || 0;
    }

    // Build request tracking data
    const requestTracking = requests.map((request) => {
      const requestKey = request._id.toString();

      const quoteData = quotesByRequest[requestKey] || {
        received: 0,
        approved: 0,
      };

      const billData = billsByRequest[requestKey] || {
        count: 0,
        vendors: [],
        customerTotal: 0,
        commission: 0,
      };

      // Remove duplicate vendors
      const uniqueVendors = Array.from(
        new Map(
          billData.vendors.map((vendor) => [
            vendor.id.toString(),
            vendor,
          ])
        ).values()
      );

      return {
        _id: request._id,
        requestId: request.requestId,
        customer: request.customer,
        status: request.status,

        items: request.items?.length || 0,

        quotesReceived: quoteData.received,
        quotesApproved: quoteData.approved,

        billsGenerated: billData.count,

        vendorsInvolved: uniqueVendors,

        customerTotal: billData.customerTotal,
        commission: billData.commission,

        createdAt: request.createdAt,
      };
    });

    res.json({
      summary: {
        totalRequests,
        totalQuotes,
        totalBills,
        totalProcurementValue,
        totalCommission,
      },

      pendingActions: {
        requestsToPublish: pendingRequests,
        quotesToApprove: pendingQuotes,
        usersToApprove: pendingUsers,
      },

      requestTracking,
    });
  } catch (err) {
    console.error("❌ Error loading admin dashboard:", err);

    res.status(500).json({
      message: "Error loading dashboard data",
    });
  }
};