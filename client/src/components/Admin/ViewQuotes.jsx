import { useState, useEffect } from "react";
import API from "../../services/api";

export default function ViewQuotes() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    API.get("/quotes").then((r) => setQuotes(r.data));
  }, []);

  return (
    <div className="p-4">
      <h2>View Quotes</h2>
      {quotes.map((q) => (
        <div key={q._id} className="p-3 bg-gray-100 rounded shadow mb-2">
          <div>Vendor: {q.vendorId.name}</div>
          <div>Amount: ₹{q.amount}</div>
        </div>
      ))}
    </div>
  );
}
