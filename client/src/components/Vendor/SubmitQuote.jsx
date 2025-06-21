import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

export default function SubmitQuote() {
  const { requestId } = useParams();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/quotes", { requestId, amount: Number(amount) });
    alert("Quote submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow mx-auto mt-8 max-w-md"
    >
      <h2>Quote for {requestId}</h2>
      <input
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Submit
      </button>
    </form>
  );
}
