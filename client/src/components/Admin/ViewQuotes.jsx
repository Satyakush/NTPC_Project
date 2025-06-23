// src/components/Admin/ViewQuotes.jsx
import React, { useEffect, useState } from "react";

export default function ViewQuotes() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((res) => res.json())
      .then(setQuotes);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">All Submitted Quotes</h2>
      <div className="grid gap-4">
        {quotes.map((quote, i) => (
          <div key={i} className="bg-white p-4 shadow rounded border">
            <p><strong>Vendor:</strong> {quote.vendor}</p>
            <p><strong>Item:</strong> {quote.item}</p>
            <p><strong>Quote:</strong> ₹{quote.amount}</p>
            <p><strong>Status:</strong> <span className="font-medium text-blue-700">{quote.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
