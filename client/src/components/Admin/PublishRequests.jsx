// src/components/Admin/PublishRequests.jsx
import React, { useEffect, useState } from "react";

export default function PublishRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/admin/publish-requests")
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  const handlePublish = async (id) => {
    await fetch(`/api/admin/publish/${id}`, { method: "POST" });
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Publish Requests</h2>
      {requests.length === 0 ? <p>No new requests to publish.</p> : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-4 rounded shadow border">
              <h3 className="text-lg font-semibold">{req.item}</h3>
              <p>Quantity: {req.quantity}</p>
              <p>Description: {req.description}</p>
              <button
                onClick={() => handlePublish(req._id)}
                className="mt-2 px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Publish
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
