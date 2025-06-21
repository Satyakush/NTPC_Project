import { useState, useEffect } from "react";
import API from "../../services/api.jsx";

export default function ViewBills() {
  const [bills, setBills] = useState([]);
  useEffect(() => API.get("/bills").then((r) => setBills(r.data)), []);

  return (
    <div className="p-4">
      <h2>All Bills</h2>
      {bills.map((b) => (
        <div key={b._id} className="p-3 bg-green-50 rounded shadow mb-2">
          <div>Req: {b.requestId.requestId}</div>
          <div>Cust: {b.customerId.name}</div>
          <div>Vend: {b.vendorId.name}</div>
          <div>Total: ₹{b.totalAmount}</div>
        </div>
      ))}
    </div>
  );
}
