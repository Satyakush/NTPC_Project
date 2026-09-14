import { useEffect, useState } from "react";
import axios from "../../utils/api";

const VendorBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("/bills/vendor");
        setBills(res.data);
      } catch (err) {
        console.error("Error fetching vendor bills:", err);
        setError("Failed to load your bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="mb-6 text-2xl font-bold text-indigo-800">Bills Generated for Me</h2>
        <p className="text-gray-500">Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="mb-6 text-2xl font-bold text-indigo-800">Bills Generated for Me</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-bold text-indigo-800">Bills Generated for Me</h2>

      {bills.length === 0 ? (
        <p className="text-gray-500">No bills generated yet.</p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => {
            const paymentStatus = bill.paymentStatus || "pending";
            const totalAmount = Math.max(0, Number(bill.customerTotal || 0));
            const amountPaid = Math.min(totalAmount, Math.max(0, Number(bill.amountPaid || 0)));
            const amountRemaining = Math.max(0, totalAmount - amountPaid);
            const paymentProgress = totalAmount > 0 ? Math.min(100, (amountPaid / totalAmount) * 100) : 0;
            const statusClasses = {
              paid: "bg-green-100 text-green-700",
              failed: "bg-red-100 text-red-700",
              pending: "bg-yellow-100 text-yellow-700",
            };

            return (
              <div key={bill._id} className="rounded-lg border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="font-semibold text-blue-600">{bill.request?.requestId || "N/A"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClasses[paymentStatus] || statusClasses.pending}`}>
                    {paymentStatus === "paid" ? "Paid" : paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                  </span>
                </div>

                <div className="space-y-3">
                  <p>
                    <strong>Customer:</strong> {bill.customer?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">{bill.customer?.email || ""}</p>
                  <p>
                    <strong>Amount to Receive:</strong>{" "}
                    <span className="text-lg font-semibold text-green-700">
                      ₹{Number(bill.vendorAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Customer Total</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Paid So Far</p>
                      <p className="mt-1 font-semibold text-green-700">
                        ₹{amountPaid.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Still Left</p>
                      <p className="mt-1 font-semibold text-yellow-700">
                        ₹{amountRemaining.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span>Payment Progress</span>
                      <span>{paymentProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${paymentProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    <strong>Generated On:</strong> {bill.generatedAt ? new Date(bill.generatedAt).toLocaleDateString("en-IN") : "N/A"}
                  </p>
                  {bill.paidAt && (
                    <p className="text-sm text-gray-500">
                      <strong>Customer Paid On:</strong> {new Date(bill.paidAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                {paymentStatus === "paid" && (
                  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    Customer payment has been received successfully.
                  </div>
                )}

                {paymentStatus === "pending" && amountPaid > 0 && (
                  <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                    Customer has paid ₹{amountPaid.toLocaleString("en-IN")} so far. ₹{amountRemaining.toLocaleString("en-IN")} is still pending.
                  </div>
                )}

                {paymentStatus === "failed" && bill.paymentFailureReason && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {bill.paymentFailureReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorBills;