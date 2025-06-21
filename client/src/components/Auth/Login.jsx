import { useState } from "react";
import { useAuth } from "../../services/auth.jsx";
import API from "../../services/api";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", formData);
      login(response.data.token);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow mt-8"
    >
      <h2>Login</h2>
      <input
        name="email"
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full p-2 border"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        className="w-full p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Login
      </button>
    </form>
  );
}
