import { useEffect, useState } from "react";
import axios from "../../utils/api";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/dashboard/admin");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getStatusLabel = (status) => {
    if (status === "draft") return "DRAFT";
    if (status === "pending") return "PENDING";
    if (status === "published") return "PUBLISHED";
    if (status === "approved") return "APPROVED";
    if (status === "billed") return "BILLED";
    return status?.toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "billed": return "bg-green-100 text-green-700";
      case "published": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-purple-100 text-purple-700";
      case "draft": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLifecycle = (request) => ({
    created: true,
    published: ["published", "approved", "billed"].includes(request.status),
    quotesReceived: request.quotesReceived > 0,
    quotesApproved: request.quotesApproved > 0,
    billGenerated: request.billsGenerated > 0,
    billsPaid: request.billsPaymentComplete,
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { summary, pendingActions, requestTracking } = data;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-gray-500">Overview of the complete procurement process</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">Total Requests</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{summary.totalRequests}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">Quotes Received</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{summary.totalQuotes}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">Bills Generated</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{summary.totalBills}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">Bills Paid</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{summary.paidBills}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">Commission Earned</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{formatCurrency(summary.totalCommission)}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-gray-500">Total Procurement Value</p>
        <p className="mt-2 text-4xl font-bold text-green-700">{formatCurrency(summary.totalProcurementValue)}</p>
      </div>

      <div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900">Pending Actions</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-gray-500">Requests to Publish</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{pendingActions.requestsToPublish}</p>
            <p className="mt-1 text-sm text-gray-400">Awaiting publication</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-gray-500">Quotes to Approve</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingActions.quotesToApprove}</p>
            <p className="mt-1 text-sm text-gray-400">Awaiting review</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-gray-500">Users to Approve</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">{pendingActions.usersToApprove}</p>
            <p className="mt-1 text-sm text-gray-400">Awaiting approval</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900">Request Tracking</h3>
        <div className="space-y-5">
          {requestTracking.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">No requests available.</div>
          ) : (
            requestTracking.map((request) => {
              const lifecycle = getLifecycle(request);

              return (
                <div key={request._id} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Request ID</p>
                      <p className="text-xl font-bold text-blue-600">{request.requestId}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Customer: <span className="font-medium">{request.customer?.name || request.customer?.email || "Unknown"}</span>
                      </p>
                    </div>
                    <span className={`self-start rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Items</p>
                      <p className="text-2xl font-bold">{request.items}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Quotes Received</p>
                      <p className="text-2xl font-bold text-indigo-600">{request.quotesReceived}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Quotes Approved</p>
                      <p className="text-2xl font-bold text-green-600">{request.quotesApproved}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Bills Generated</p>
                      <p className="text-2xl font-bold text-orange-600">{request.billsGenerated}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Bills Paid</p>
                      <p className="text-2xl font-bold text-green-600">{request.billsPaid}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-t pt-5 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Customer Total</p>
                      <p className="text-xl font-bold text-green-700">{formatCurrency(request.customerTotal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cooperative Commission</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(request.commission)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vendors Involved</p>
                      {request.vendorsInvolved.length === 0 ? (
                        <p className="mt-1 text-gray-400">No vendor assigned yet</p>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {request.vendorsInvolved.map((vendor) => (
                            <p key={vendor.id} className="font-medium text-gray-800">{vendor.name || vendor.email}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-5">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Procurement Lifecycle</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`rounded-full px-3 py-2 ${lifecycle.created ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>✓ Request Created</span>
                      <span className="text-gray-400">→</span>
                      <span className={`rounded-full px-3 py-2 ${lifecycle.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{lifecycle.published ? "✓ " : ""}Published</span>
                      <span className="text-gray-400">→</span>
                      <span className={`rounded-full px-3 py-2 ${lifecycle.quotesReceived ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{lifecycle.quotesReceived ? "✓ " : ""}Quotes Received</span>
                      <span className="text-gray-400">→</span>
                      <span className={`rounded-full px-3 py-2 ${lifecycle.quotesApproved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{lifecycle.quotesApproved ? "✓ " : ""}Quotes Approved</span>
                      <span className="text-gray-400">→</span>
                      <span className={`rounded-full px-3 py-2 ${lifecycle.billGenerated ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{lifecycle.billGenerated ? "✓ " : ""}Bill Generated</span>
                      <span className="text-gray-400">→</span>
                      <span className={`rounded-full px-3 py-2 ${lifecycle.billsPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{lifecycle.billsPaid ? "✓ " : ""}Bills Paid</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;