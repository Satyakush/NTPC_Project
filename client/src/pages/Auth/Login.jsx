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
  const [showPassword, setShowPassword] = useState(false);\n\n  const EyeIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;\n  const EyeOffIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.1 3.7M6.2 6.8C3.8 8.3 2.5 12 2.5 12s3.4 6 9.5 6c1.3 0 2.5-.3 3.5-.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;

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
                <div className="procure-login__password-wrap"><input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" autoComplete="current-password" /><button type="button" className="procure-login__toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>
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
