import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/api";

const createSubmissionKey = () =>
  window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

const SubmitQuote = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readableRequestId, setReadableRequestId] = useState("");
  const submissionKeyRef = useRef(createSubmissionKey());

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`/requests/${requestId}`);
        setReadableRequestId(res.data.requestId);
        setQuotes(
          res.data.items.map((item) => ({
            itemId: item._id,
            itemName: item.name,
            price: "",
            remark: "",
          }))
        );
      } catch (err) {
        console.error("❌ Failed to fetch request:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleChange = (index, field, value) => {
    const updated = [...quotes];
    updated[index][field] = value;
    setQuotes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      await Promise.all(
        quotes.map((quote, index) =>
          axios.post(
            `/quotes/${encodeURIComponent(readableRequestId)}`,
            {
              itemName: quote.itemName,
              price: quote.price,
              remark: quote.remark,
            },
            {
              headers: {
                "Idempotency-Key": `${submissionKeyRef.current}-${index}`,
              },
            }
          )
        )
      );

      alert("✅ Quotes submitted successfully!");
      submissionKeyRef.current = createSubmissionKey();
      navigate("/vendor/quotes");
    } catch (err) {
      console.error("❌ Error submitting quotes:", err);
      alert(err.response?.data?.message || "Error submitting quotes. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Submit Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {quotes.map((quote, index) => (
          <div key={quote.itemId || index} className="border p-4 rounded shadow bg-white">
            <p className="font-semibold mb-2">
              🛒 Item: <span className="text-gray-800">{quote.itemName}</span>
            </p>
            <label className="block mb-1 text-sm text-gray-600">
              Price (₹)
            </label>
            <input
              type="number"
              value={quote.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              placeholder="Enter price in INR"
              className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring"
              required
              disabled={submitting}
            />
            <label className="block mb-1 text-sm text-gray-600">
              Remark (optional)
            </label>
            <textarea
              value={quote.remark}
              onChange={(e) => handleChange(index, "remark", e.target.value)}
              placeholder="Any specific notes or delivery time..."
              className="w-full border rounded px-3 py-2 h-20 focus:outline-none focus:ring"
              disabled={submitting}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting Quotes..." : "📤 Submit All Quotes"}
        </button>
      </form>
    </div>
  );
};

export default SubmitQuote;
