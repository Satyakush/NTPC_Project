import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function ViewQuotes() {
  const [reqId, setReqId] = useState("");
  const [quotes, setQuotes] = useState([]);
  const fetch = () =>
    API.get(`/quotes/${reqId}`).then((r) => setQuotes(r.data));

  return (
    <div className="p-4">
      <h2>View Quotes</h2>
      <input
        placeholder="Request ID"
        onChange={(e) => setReqId(e.target.value)}
        className="mb-2"
      />
      <button onClick={fetch}>Fetch</button>
      {quotes.map((q) => (
        <div key={q._id} className="p-3 bg-gray-100 rounded shadow mb-2">
          <div>Vendor: {q.vendorId.name}</div>
          <div>Amount: ₹{q.amount}</div>
        </div>
      ))}
    </div>
  );
}
