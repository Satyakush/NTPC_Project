import { useEffect, useState } from "react";
import axios from "../../utils/api";

const CustomerBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("/bills/customer");
        setBills(res.data);
      } catch (err) {
        console.error("❌ Error fetching customer bills:", err);
        setError("Failed to load your bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Bills</h2>
        <p className="text-gray-500">Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Bills</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Bills</h2>

      {bills.length === 0 ? (
        <p className="text-gray-500">No bills generated yet.</p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="p-5 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="font-semibold text-blue-600">
                    {bill.request?.requestId || "N/A"}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  Generated
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Vendor:</strong>{" "}
                  {bill.vendor?.organization ||
                    bill.vendor?.name ||
                    "N/A"}
                </p>

                <p>
                  <strong>Amount Payable:</strong>{" "}
                  <span className="text-lg font-semibold text-green-700">
                    ₹
                    {Number(bill.customerTotal || 0).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  <strong>Generated On:</strong>{" "}
                  {bill.generatedAt
                    ? new Date(bill.generatedAt).toLocaleDateString(
                        "en-IN"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBills;