// src/components/Customer/CreateRequest.jsx
import React, { useState } from "react";

export default function CreateRequest() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/customer/create-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, quantity, description }),
    });

    if (res.ok) {
      alert("Request submitted");
      setItem("");
      setQuantity("");
      setDescription("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Create New Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Item</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Submit Request
        </button>
      </form>
    </div>
  );
}
