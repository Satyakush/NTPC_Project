import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    address: "",
    gstNumber: "",
    password: "",
    role: "customer", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registered successfully! Wait for approval.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />
      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />
      <input
        name="organization"
        placeholder="Organization"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="address"
        placeholder="Address"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="gstNumber"
        placeholder="GST Number"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border"
      >
        <option value="customer">Customer</option>
        <option value="vendor">Vendor</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Register
      </button>
    </form>
  );
}
