import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await axios.get("/auth/pending");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch pending users:", err);
    }
  };

  const approve = async (id) => {
    if (processingId) return;

    setProcessingId(id);

    try {
      await axios.put(`/auth/approve/${id}`);
      await fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to approve user.");
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id) => {
    if (processingId) return;

    if (!window.confirm("Are you sure you want to reject this user?")) return;

    setProcessingId(id);

    try {
      await axios.delete(`/auth/reject/${id}`);
      await fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to reject user.");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Approve New Users</h2>
      {users.length === 0 && (
        <p className="text-gray-600">No pending registrations found.</p>
      )}
      {users.map((u) => (
        <div
          key={u._id}
          className="mb-6 p-4 border rounded shadow-sm bg-white space-y-2"
        >
          <p>
            <strong>Name:</strong> {u.name}
          </p>
          <p>
            <strong>Email:</strong> {u.email}
          </p>
          <p>
            <strong>Role:</strong> {u.role}
          </p>
          {u.role === "vendor" && (
            <>
              <p>
                <strong>Organization:</strong> {u.organization}
              </p>
              <p>
                <strong>GSTIN:</strong> {u.gstin}
              </p>
              <div>
                <strong>Vendor Items:</strong>
                <ul className="list-disc pl-6 mt-1">
                  {u.vendorItems?.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.name}</strong>: {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {u.note && (
            <p>
              <strong>Note:</strong> {u.note}
            </p>
          )}

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => approve(u._id)}
              disabled={processingId !== null}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingId === u._id ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={() => reject(u._id)}
              disabled={processingId !== null}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingId === u._id ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveUsers;
