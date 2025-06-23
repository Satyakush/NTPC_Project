// src/components/Admin/ApproveUsers.jsx
import React, { useEffect, useState } from "react";

export default function ApproveUsers() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch("/api/admin/pending")
      .then((res) => res.json())
      .then(setPending);
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/admin/approve/${id}`, { method: "POST" });
    setPending((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Approve Users</h2>
      {pending.length === 0 ? <p>No users pending approval.</p> : (
        <ul className="space-y-4">
          {pending.map((user) => (
            <li key={user._id} className="bg-white p-4 rounded shadow border">
              <p className="font-semibold">{user.name} ({user.role})</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <button
                onClick={() => handleApprove(user._id)}
                className="mt-2 px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
