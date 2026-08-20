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
        console.error("❌ Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

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
      case "billed":
        return "bg-green-100 text-green-700";

      case "published":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "approved":
        return "bg-purple-100 text-purple-700";

      case "draft":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLifecycle = (request) => {
    const created = true;
    const published = [
      "published",
      "approved",
      "billed",
    ].includes(request.status);

    const quotesReceived = request.quotesReceived > 0;

    const quotesApproved = request.quotesApproved > 0;

    const billGenerated = request.billsGenerated > 0;

    return {
      created,
      published,
      quotesReceived,
      quotesApproved,
      billGenerated,
    };
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const {
    summary,
    pendingActions,
    requestTracking,
  } = data;

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="text-gray-500 mt-1">
          Overview of the complete procurement process
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-500">Total Requests</p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {summary.totalRequests}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-500">Quotes Received</p>

          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {summary.totalQuotes}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-500">Bills Generated</p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary.totalBills}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-500">Commission Earned</p>

          <p className="text-3xl font-bold text-orange-600 mt-2">
            {formatCurrency(summary.totalCommission)}
          </p>
        </div>
      </div>

      {/* Procurement Value */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-gray-500">
          Total Procurement Value
        </p>

        <p className="text-4xl font-bold text-green-700 mt-2">
          {formatCurrency(summary.totalProcurementValue)}
        </p>
      </div>

      {/* Pending Actions */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Pending Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500">
              Requests to Publish
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {pendingActions.requestsToPublish}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Awaiting publication
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500">
              Quotes to Approve
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingActions.quotesToApprove}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Awaiting review
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500">
              Users to Approve
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {pendingActions.usersToApprove}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Awaiting approval
            </p>
          </div>

        </div>
      </div>

      {/* Request Tracking */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Request Tracking
        </h3>

        <div className="space-y-5">

          {requestTracking.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
              No requests available.
            </div>
          ) : (
            requestTracking.map((request) => {
              const lifecycle = getLifecycle(request);

              return (
                <div
                  key={request._id}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >

                  {/* Request Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Request ID
                      </p>

                      <p className="text-xl font-bold text-blue-600">
                        {request.requestId}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        Customer:{" "}
                        <span className="font-medium">
                          {request.customer?.name ||
                            request.customer?.email ||
                            "Unknown"}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold self-start ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>

                  </div>

                  {/* Request Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Items
                      </p>

                      <p className="text-2xl font-bold">
                        {request.items}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Quotes Received
                      </p>

                      <p className="text-2xl font-bold text-indigo-600">
                        {request.quotesReceived}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Quotes Approved
                      </p>

                      <p className="text-2xl font-bold text-green-600">
                        {request.quotesApproved}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Bills Generated
                      </p>

                      <p className="text-2xl font-bold text-orange-600">
                        {request.billsGenerated}
                      </p>
                    </div>

                  </div>

                  {/* Money + Vendors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t">

                    <div>
                      <p className="text-sm text-gray-500">
                        Customer Total
                      </p>

                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(request.customerTotal)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Cooperative Commission
                      </p>

                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(request.commission)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Vendors Involved
                      </p>

                      {request.vendorsInvolved.length === 0 ? (
                        <p className="text-gray-400 mt-1">
                          No vendor assigned yet
                        </p>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {request.vendorsInvolved.map((vendor) => (
                            <p
                              key={vendor.id}
                              className="font-medium text-gray-800"
                            >
                              {vendor.name || vendor.email}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Lifecycle */}
                  <div className="mt-5 pt-5 border-t">

                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Procurement Lifecycle
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm">

                      <span
                        className={`px-3 py-2 rounded-full ${
                          lifecycle.created
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lifecycle.created ? "✓ " : ""}
                        Request Created
                      </span>

                      <span className="text-gray-400">
                        →
                      </span>

                      <span
                        className={`px-3 py-2 rounded-full ${
                          lifecycle.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lifecycle.published ? "✓ " : ""}
                        Published
                      </span>

                      <span className="text-gray-400">
                        →
                      </span>

                      <span
                        className={`px-3 py-2 rounded-full ${
                          lifecycle.quotesReceived
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lifecycle.quotesReceived ? "✓ " : ""}
                        Quotes Received
                      </span>

                      <span className="text-gray-400">
                        →
                      </span>

                      <span
                        className={`px-3 py-2 rounded-full ${
                          lifecycle.quotesApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lifecycle.quotesApproved ? "✓ " : ""}
                        Quotes Approved
                      </span>

                      <span className="text-gray-400">
                        →
                      </span>

                      <span
                        className={`px-3 py-2 rounded-full ${
                          lifecycle.billGenerated
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lifecycle.billGenerated ? "✓ " : ""}
                        Bill Generated
                      </span>

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