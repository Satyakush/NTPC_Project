import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function PublishRequests() {
  const [reqs, setReqs] = useState([]);
  useEffect(() => {
    API.get("/requests").then((r) => setReqs(r.data));
  }, []);

  const pub = async (reqId) => {
    await API.post("/requests/publish", { requestId: reqId });
    setReqs(
      reqs.map((r) => (r.requestId === reqId ? { ...r, isPublished: true } : r))
    );
  };

  return (
    <div className="p-4">
      <h2>Publish Requests</h2>
      {reqs.map((r) => (
        <div
          key={r._id}
          className="p-3 bg-gray-50 rounded shadow mb-2 flex justify-between"
        >
          <span>
            {r.requestId} ({r.isPublished ? "Published" : "Draft"})
          </span>
          {!r.isPublished && (
            <button onClick={() => pub(r.requestId)}>Publish</button>
          )}
        </div>
      ))}
    </div>
  );
}
