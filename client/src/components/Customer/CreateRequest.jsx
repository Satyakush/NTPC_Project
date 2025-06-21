import { useState } from "react";
import API from "../../services/api.jsx";

export default function CreateRequest() {
  const [items, setItems] = useState("");
  const sub = async (e) => {
    e.preventDefault();
    await API.post("/requests", { items: items.split(",") });
    alert("Request created!");
  };
  return (
    <form onSubmit={sub} className="p-4 bg-white shadow mx-auto mt-8 max-w-md">
      <h2>Create Request</h2>
      <textarea
        placeholder="Item1, Item2"
        onChange={(e) => setItems(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
}
