import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import "./login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const user = await login(form.email, form.password, remember);
    setLoading(false);

    if (user) {
      if (user.role === "cooperative") navigate("/admin/dashboard");
      else if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } else {
      setError("Invalid login credentials.");
    }
  };

  return (
    <main className="procure-login">
      <div className="procure-login__layout">
        <section className="procure-login__intro">
          <div className="procure-login__eyebrow"><Sparkles size={14} /> ProcureHub</div>
          <h1>Procurement, <span>connected.</span></h1>
          <p>A unified workspace for customers, vendors, and cooperative teams to move every procurement request forward.</p>
          <div className="procure-login__steps">
            {["Requests", "Quotes", "Bills"].map((item, i) => (
              <div key={item} className="procure-login__step"><small>0{i + 1}</small><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="procure-login__card">
          <div className="procure-login__mobile-brand">
            <span>ProcureHub</span>
            <h1>Procurement, connected.</h1>
          </div>

          <p className="procure-login__subtitle">SECURE WORKSPACE</p>
          <h2>Welcome back.</h2>
          <p className="procure-login__subtitle">Sign in to continue your procurement workflow.</p>

          {error && <div className="procure-login__error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="procure-login__form">
            <label className="procure-login__field">
              <span>Email address</span>
              <div className="procure-login__control">
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="" placeholder="you@company.com" autoComplete="email" />
              </div>
            </label>

            <label className="procure-login__field">
              <span>Password</span>
              <div className="procure-login__control">
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" autoComplete="current-password" />
              </div>
            </label>

            <label className="procure-login__remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>

            <button type="submit" disabled={loading} className="procure-login__submit">
              {loading ? "Authenticating..." : "Enter workspace →"}
            </button>
          </form>

          <p className="procure-login__footer">Need an account? <Link to="/register">Create one</Link></p>
          <div className="procure-login__security"><ShieldCheck size={14} /> Role-based secure access</div>
        </motion.section>
      </div>
    </main>
  );
};

export default Login;
