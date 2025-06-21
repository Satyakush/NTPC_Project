import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api.jsx";

export default function SubmitQuote() {
  const { requestId } = useParams();
  const [amount, setAmount] = useState("");
  const sub = async (e) => {
    e.preventDefault();
    await API.post("/quotes", { requestId, amount: Number(amount) });
    alert("Quote submitted!");
  };
  return (
    <form onSubmit={sub} className="p-4 bg-white shadow mx-auto mt-8 max-w-md">
      <h2>Quote for {requestId}</h2>
      <input
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
