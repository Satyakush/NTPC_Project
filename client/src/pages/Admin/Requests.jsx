import { useEffect, useState } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests/all");
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const publish = async (id) => {
    if (processingId) return;

    setProcessingId(id);

    try {
      await axios.put(`/requests/publish/${id}`);
      alert("✅ Request published!");
      await fetchRequests();
    } catch (err) {
      console.error("❌ Publish error:", err);
      alert(err.response?.data?.message || "Failed to publish request.");
    } finally {
      setProcessingId(null);
    }
  };

  const finalize = async (id) => {
    if (processingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to finalize this request and generate the bills?"
    );

    if (!confirmed) return;

    setProcessingId(id);

    try {
      const res = await axios.put(`/requests/finalize/${id}`);

      alert(
        `✅ Request finalized successfully!\n${res.data.bills.length} bill(s) generated.`
      );

      await fetchRequests();
    } catch (err) {
      console.error("❌ Finalize error:", err);
      alert(err.response?.data?.message || "Failed to finalize request.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <h2 className="text-center text-3xl font-bold mb-8 text-indigo-800">
        Manage All Requests
      </h2>

      <div className="space-y-5 max-w-5xl mx-auto">
        {requests.length === 0 ? (
          <p className="text-center text-gray-600">No requests found.</p>
        ) : (
          requests.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Request ID: <span className="text-blue-600">{r.requestId}</span>
                </h3>

                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    r.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : r.status === "published"
                      ? "bg-blue-100 text-blue-800"
                      : r.status === "billed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {r.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm mb-2 text-gray-600">
                <strong>Customer:</strong> {r.customer?.email || "Unknown"}
              </p>

              <ul className="text-sm list-disc list-inside text-gray-700 mb-3">
                {r.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — Qty: <span className="font-medium">{item.quantity}</span>
                  </li>
                ))}
              </ul>

              {user?.role === "cooperative" &&
                (r.status === "draft" || r.status === "pending") && (
                  <button
                    onClick={() => publish(r._id)}
                    disabled={processingId !== null}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processingId === r._id ? "Publishing..." : "📢 Publish to Vendors"}
                  </button>
                )}

              {user?.role === "cooperative" && r.status === "published" && (
                <button
                  onClick={() => finalize(r._id)}
                  disabled={processingId !== null}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processingId === r._id
                    ? "Finalizing..."
                    : "💰 Finalize & Generate Bills"}
                </button>
              )}

              {r.status === "billed" && (
                <p className="mt-3 text-green-700 font-semibold">
                  ✅ Request finalized and bills generated.
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>

      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default ManageRequests;
