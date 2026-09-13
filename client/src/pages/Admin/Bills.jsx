import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ManageBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("/bills/all");
        setBills(res.data);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Failed to load bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-bold">All Bills</h2>
        <p className="text-gray-500">Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-bold">All Bills</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">All Bills</h2>
        <p className="text-sm text-gray-500">{bills.length} bill{bills.length === 1 ? "" : "s"}</p>
      </div>

      {bills.length === 0 ? (
        <p className="text-gray-500">No bills generated yet.</p>
      ) : (
        <div className="space-y-5">
          {bills.map((bill) => {
            const paymentStatus = bill.paymentStatus || "pending";
            const statusClasses = {
              paid: "bg-green-100 text-green-700",
              failed: "bg-red-100 text-red-700",
              pending: "bg-yellow-100 text-yellow-700",
            };

            return (
              <div key={bill._id} className="rounded-lg border bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="font-semibold text-blue-600">{bill.request?.requestId || "N/A"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClasses[paymentStatus] || statusClasses.pending}`}>
                    {paymentStatus === "paid" ? "Paid" : paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                  </span>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{bill.customer?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">{bill.customer?.email || ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-medium">{bill.vendor?.organization || bill.vendor?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">{bill.vendor?.email || ""}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Vendor Amount</span>
                    <span className="font-medium">₹{Number(bill.vendorAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Cooperative Commission (8%)</span>
                    <span className="font-semibold text-orange-600">₹{Number(bill.commission || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t pt-3">
                    <span className="font-bold">Customer Total</span>
                    <span className="text-lg font-bold text-green-700">₹{Number(bill.customerTotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {paymentStatus === "failed" && bill.paymentFailureReason && (
                  <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {bill.paymentFailureReason}
                  </p>
                )}

                {bill.razorpayPaymentId && (
                  <p className="mt-4 break-all text-xs text-gray-500">
                    Payment ID: {bill.razorpayPaymentId}
                  </p>
                )}

                {bill.paidAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Paid On:</strong> {new Date(bill.paidAt).toLocaleDateString("en-IN")}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  <strong>Generated On:</strong> {bill.generatedAt ? new Date(bill.generatedAt).toLocaleDateString("en-IN") : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageBills;