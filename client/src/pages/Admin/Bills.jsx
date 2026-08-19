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
        console.error("❌ Error fetching bills:", err);
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
        <h2 className="text-2xl font-bold mb-6">
          All Bills
        </h2>
        <p className="text-gray-500">Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          All Bills
        </h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        All Bills
      </h2>

      {bills.length === 0 ? (
        <p className="text-gray-500">
          No bills generated yet.
        </p>
      ) : (
        <div className="space-y-5">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="p-5 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Request ID
                  </p>

                  <p className="font-semibold text-blue-600">
                    {bill.request?.requestId || "N/A"}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  Generated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-medium">
                    {bill.customer?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {bill.customer?.email || ""}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Vendor
                  </p>

                  <p className="font-medium">
                    {bill.vendor?.organization ||
                      bill.vendor?.name ||
                      "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {bill.vendor?.email || ""}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Vendor Amount
                  </span>

                  <span className="font-medium">
                    ₹
                    {Number(
                      bill.vendorAmount || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Cooperative Commission (8%)
                  </span>

                  <span className="font-semibold text-orange-600">
                    ₹
                    {Number(
                      bill.commission || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold">
                    Customer Total
                  </span>

                  <span className="font-bold text-green-700 text-lg">
                    ₹
                    {Number(
                      bill.customerTotal || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                <strong>Generated On:</strong>{" "}
                {bill.generatedAt
                  ? new Date(
                      bill.generatedAt
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBills;