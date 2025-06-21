import { useState, useEffect } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

export default function PublishedRequests() {
  const [reqs, setReqs] = useState([]);

  useEffect(() => {
    API.get("/requests?search=").then((r) => setReqs(r.data));
  }, []);

  return (
    <div className="p-4">
      <h2>Available Requests</h2>
      {reqs.map(
        (r) =>
          r.isPublished && (
            <div
              key={r._id}
              className="bg-gray-100 p-3 rounded mb-2 flex justify-between"
            >
              <span>{r.requestId}</span>
              <Link
                to={`/vendor/submit-quote/${r.requestId}`}
                className="text-blue-500"
              >
                Quote
              </Link>
            </div>
          )
      )}
    </div>
  );
}
