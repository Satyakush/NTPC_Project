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

                <div className="space-y-2">
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