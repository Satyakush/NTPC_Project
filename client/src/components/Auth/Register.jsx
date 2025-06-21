import { useState } from "react";
import API from "../../services/api.jsx";

export default function Register() {
  const [f, s] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const sub = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", f);
    alert("Registered — wait for approval.");
  };
  return (
    <form onSubmit={sub} className="max-w-md mx-auto p-4 bg-white shadow mt-8">
      <h2>Register</h2>
      <select
        name="role"
        value={f.role}
        onChange={(e) => s({ ...f, role: e.target.value })}
      >
        <option value="customer">Customer</option>
        <option value="vendor">Vendor</option>
      </select>
      <input
        name="name"
        placeholder="Name"
        onChange={(e) => s({ ...f, name: e.target.value })}
      />
      <input
        name="email"
        placeholder="Email"
        onChange={(e) => s({ ...f, email: e.target.value })}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={(e) => s({ ...f, password: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
}
