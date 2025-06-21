import { useState, useEffect } from "react";
import API from "../../services/api";

export default function MyBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchMyBills = async () => {
      try {
        const response = await API.get("/bills/mine");
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching my bills:", error);
        alert("Failed to fetch your bills. Please try again later.");
      }
    };

    fetchMyBills();
  }, []);

  return (
    <div className="p-4">
      <h2>My Bills</h2>
      {bills.length === 0 ? (
        <p>No bills available.</p>
      ) : (
        bills.map((bill) => (
          <div key={bill._id} className="p-3 bg-green-100 rounded shadow mb-2">
            <div>Request ID: {bill.requestId.requestId}</div>
            <div>Amount: ₹{bill.amount}</div>
            <div>Commission: ₹{bill.commission}</div>
            <div>Total Amount: ₹{bill.totalAmount}</div>
          </div>
        ))
      )}
    </div>
  );
}
