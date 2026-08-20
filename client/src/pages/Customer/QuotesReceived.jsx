import { useEffect, useState } from "react";
import axios from "../../utils/api";

const QuotesReceived = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get("/quotes/received");
        setQuotes(res.data);
      } catch (err) {
        console.error("Error fetching received quotes:", err);
        setError(
          err.response?.data?.message || "Unable to load received quotes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Quotes Received
        </h2>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
            <p className="text-gray-500 text-lg">
              No quotes have been received yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {quotes.map((quote) => (
              <div
                key={quote._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {quote.request?.requestId || quote.requestId}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      quote.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : quote.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t pt-5">
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-semibold text-gray-900">
                      {quote.vendor?.name || "N/A"}
                    </p>

                    {quote.vendor?.organization && (
                      <p className="text-sm text-gray-500 mt-1">
                        {quote.vendor.organization}
                      </p>
                    )}

                    {quote.vendor?.email && (
                      <p className="text-sm text-gray-500">
                        {quote.vendor.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Item</p>
                    <p className="font-semibold text-gray-900">
                      {quote.item?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Quoted Price</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{Number(quote.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vendor Remark</p>
                    <p className="text-gray-800">
                      {quote.remark || "No remark provided"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesReceived;