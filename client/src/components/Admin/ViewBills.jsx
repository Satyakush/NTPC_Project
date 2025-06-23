
// src/components/Admin/ViewBills.jsx
import React, { useEffect, useState } from "react";

export default function ViewBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch("/api/admin/bills")
      .then((res) => res.json())
      .then(setBills);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">All Bills</h2>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left">Item</th>
            <th className="px-4 py-2 text-left">Vendor</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{bill.item}</td>
              <td className="px-4 py-2">{bill.vendor}</td>
              <td className="px-4 py-2">₹{bill.amount}</td>
              <td className="px-4 py-2">{bill.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
