// src/components/Auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api"; // ✅ import your Axios instance

export default function Register() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { email, name, password, role };
    if (role === "vendor") body.items = items;

    try {
      const res = await API.post("/auth/register", body); // ✅ fixed endpoint
      if (res.status === 200) {
        alert("Registration complete. Wait for admin approval.");
        navigate("/login");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        {role === "vendor" && (
          <div>
            <label className="block mb-1">Items Selling</label>
            <input
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
