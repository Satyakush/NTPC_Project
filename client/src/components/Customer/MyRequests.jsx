import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function MyRequests() {
  const [data, setData] = useState([]);
  useEffect(() => {
    API.get("/requests/mine").then((r) => setData(r.data));
  }, []);
  return (
    <div className="p-4">
      <h2>My Requests</h2>
      {data.map((r) => (
        <div key={r._id} className="p-4 bg-gray-50 rounded shadow mb-2">
          <div>ID: {r.requestId}</div>
          <div>Status: {r.isPublished ? "Published" : "Draft"}</div>
        </div>
      ))}
    </div>
  );
}
