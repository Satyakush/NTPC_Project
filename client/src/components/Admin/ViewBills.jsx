import { useState, useEffect } from "react";
import API from "../../services/api";

export default function ViewBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await API.get("/bills");
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
        alert("Failed to fetch bills. Please try again later.");
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="p-4">
      <h2>All Bills</h2>
      {bills.length === 0 ? (
        <p>No bills available.</p>
      ) : (
        bills.map((bill) => (
          <div key={bill._id} className="p-3 bg-green-50 rounded shadow mb-2">
            <div>Request ID: {bill.requestId.requestId}</div>
            <div>Customer: {bill.customerId.name}</div>
            <div>Vendor: {bill.vendorId.name}</div>
            <div>Total: ₹{bill.totalAmount}</div>
          </div>
        ))
      )}
    </div>
  );
}
