// src/components/Customer/MyRequests.jsx
import React, { useEffect, useState } from "react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/customer/requests")
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Requests</h2>
      <div className="grid gap-4">
        {requests.map((req, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <h3 className="text-lg font-semibold">{req.item}</h3>
            <p className="text-sm text-gray-600">Quantity: {req.quantity}</p>
            <p className="text-sm text-gray-600">Description: {req.description}</p>
            <p className="text-sm text-gray-600">Status: <span className="font-medium text-blue-800">{req.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
