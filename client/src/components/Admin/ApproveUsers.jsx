// src/components/Admin/ApproveUsers.jsx
import { useState, useEffect } from "react";
import API from "../../services/api"; // Adjust the path as necessary

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const response = await API.get("/auth/pending"); // Fetch pending users
      setUsers(response.data);
    };
    fetchPendingUsers();
  }, []);

  const approve = async (id) => {
    await API.post("/auth/approve", { userId: id }); // Approve user
    setUsers(users.filter((u) => u._id !== id)); // Remove approved user from list
  };

  return (
    <div className="p-4">
      <h2>Approve Users</h2>
      {users.map((u) => (
        <div
          key={u._id}
          className="p-3 bg-yellow-50 rounded shadow mb-2 flex justify-between"
        >
          <span>
            {u.name} ({u.role})
          </span>
          <button onClick={() => approve(u._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
