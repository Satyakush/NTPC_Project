import { useState } from "react";
import { useAuth } from "../../services/auth.jsx";
import API from "../../services/api.jsx";

export default function Login() {
  const { login } = useAuth();
  const [f, s] = useState({ email: "", password: "" });
  const sub = async (e) => {
    e.preventDefault();
    const r = await API.post("/auth/login", f);
    login(r.data.token, r.data.user);
  };
  return (
    <form onSubmit={sub} className="max-w-md mx-auto p-4 bg-white shadow mt-8">
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
}
