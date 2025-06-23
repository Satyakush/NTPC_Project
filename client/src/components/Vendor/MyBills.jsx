// src/components/Vendor/MyBills.jsx
import React, { useEffect, useState } from "react";

export default function MyBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch("/api/vendor/bills")
      .then((res) => res.json())
      .then(setBills);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Bills</h2>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="text-left px-4 py-2">Item</th>
            <th className="text-left px-4 py-2">Amount</th>
            <th className="text-left px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{bill.item}</td>
              <td className="px-4 py-2">₹{bill.amount}</td>
              <td className="px-4 py-2">{bill.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
