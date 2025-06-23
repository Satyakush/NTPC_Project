// src/components/Vendor/SubmitQuote.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function SubmitQuote() {
  const [amount, setAmount] = useState("");
  const { requestId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/vendor/submit-quote/${requestId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (res.ok) {
      alert("Quote submitted");
      setAmount("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Submit Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Amount (in ₹)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Submit Quote
        </button>
      </form>
    </div>
  );
}
