// src/components/Vendor/MyQuotes.jsx
import React, { useEffect, useState } from "react";

export default function MyQuotes() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch("/api/vendor/quotes")
      .then((res) => res.json())
      .then(setQuotes);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Quotes</h2>
      <div className="grid gap-4">
        {quotes.map((quote, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <p><strong>Item:</strong> {quote.item}</p>
            <p><strong>Amount:</strong> ₹{quote.amount}</p>
            <p><strong>Status:</strong> <span className="text-blue-700 font-medium">{quote.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}