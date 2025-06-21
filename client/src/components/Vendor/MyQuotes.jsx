import { useState, useEffect } from "react";
import API from "../../services/api";

export default function MyQuotes() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    API.get("/quotes/mine").then((r) => setQuotes(r.data));
  }, []);

  return (
    <div className="p-4">
      <h2>My Quotes</h2>
      {quotes.map((q) => (
        <div key={q._id} className="p-4 bg-blue-50 rounded shadow mb-2">
          <div>Request: {q.requestId.requestId}</div>
          <div>Amount: ₹{q.amount}</div>
        </div>
      ))}
    </div>
  );
}
