import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    API.get("/auth/pending").then((r) => setUsers(r.data));
  }, []);

  const approve = async (id) => {
    await API.post("/auth/approve", { userId: id });
    setUsers(users.filter((u) => u._id !== id));
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
