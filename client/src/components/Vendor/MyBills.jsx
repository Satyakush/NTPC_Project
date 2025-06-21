import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function VendorMyBills() {
  const [bills, setBills] = useState([]);
  useEffect(() => {
    API.get("/bills/mine").then((r) => setBills(r.data));
  }, []);
  return (
    <div className="p-4">
      <h2>My Bills</h2>
      {bills.map((b) => (
        <div key={b._id} className="p-4 bg-green-100 rounded shadow mb-2">
          <div>Request: {b.requestId.requestId}</div>
          <div>Amount: ₹{b.amount}</div>
        </div>
      ))}
    </div>
  );
}
