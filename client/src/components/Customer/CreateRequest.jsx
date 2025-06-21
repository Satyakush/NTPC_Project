import { useState } from "react";
import API from "../../services/api";

export default function CreateRequest() {
  const [items, setItems] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/requests", { items: items.split(",") });
    alert("Request created!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow mx-auto mt-8 max-w-md"
    >
      <h2>Create Request</h2>
      <textarea
        placeholder="Item1, Item2"
        onChange={(e) => setItems(e.target.value)}
        className="w-full p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Create
      </button>
    </form>
  );
}
