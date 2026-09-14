import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const fetchQuotes = async () => {
    try {
      const res = await axios.get("/quotes/all");
      setQuotes(res.data);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const approve = async (id) => {
    if (processingId) return;

    setProcessingId(id);

    try {
      await axios.put(`/quotes/approve/${id}`);
      await fetchQuotes();
    } catch (error) {
      console.error("Error approving quote:", error);
      alert(error.response?.data?.message || "Failed to approve quote.");
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id) => {
    if (processingId) return;

    setProcessingId(id);

    try {
      await axios.put(`/quotes/reject/${id}`);
      await fetchQuotes();
    } catch (error) {
      console.error("Error rejecting quote:", error);
      alert(error.response?.data?.message || "Failed to reject quote.");
    } finally {
      setProcessingId(null);
    }
  };

  const groupByRequest = quotes.reduce((acc, q) => {
    const rid = q.request?.requestId || "unknown";
    if (!acc[rid]) acc[rid] = [];
    acc[rid].push(q);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Quotes</h2>
      {Object.entries(groupByRequest).map(([requestId, quoteGroup]) => {
        const lowestByItem = quoteGroup.reduce((acc, quote) => {
          const itemName = quote.item.name.trim().toLowerCase();

          if (!acc[itemName] || quote.price < acc[itemName].price) {
            acc[itemName] = quote;
          }

          return acc;
        }, {});

        return (
          <div key={requestId} className="mb-6 p-4 border rounded">
            <p>
              <strong>Request ID:</strong> {requestId}
            </p>

            {quoteGroup.map((q) => (
              <div key={q._id} className="p-2 border mt-2 rounded">
                <p>
                  <strong>Item:</strong> {q.item.name} — ₹{q.price}
                </p>
                <p>
                  <strong>Vendor:</strong> {q.vendor?.name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      q.status === "approved"
                        ? "text-green-600"
                        : q.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {q.status}
                  </span>
                </p>

                {lowestByItem[q.item.name.trim().toLowerCase()]?._id === q._id &&
                  q.status === "pending" && (
                    <span className="text-green-600 font-semibold mr-2">
                      Lowest for this item ✅
                    </span>
                  )}

                {q.status === "pending" && (
                  <div className="mt-1">
                    <button
                      onClick={() => approve(q._id)}
                      disabled={processingId !== null}
                      className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === q._id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => reject(q._id)}
                      disabled={processingId !== null}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === q._id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ManageQuotes;
