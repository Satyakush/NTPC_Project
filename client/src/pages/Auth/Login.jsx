import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form,setForm]=useState({email:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault(); setError(""); setLoading(true);
    const user=await login(form.email,form.password); setLoading(false);
    if(user){
      if(user.role==="cooperative") navigate("/admin/dashboard");
      else if(user.role==="vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } else setError("Invalid login credentials.");
  };

  return <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#07111f] text-white">
    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"/>
    <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl"/>
    <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-2">
      <section className="hidden lg:block">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-cyan-300"><Sparkles size={14}/> ProcureHub</div>
        <h1 className="max-w-xl text-6xl font-black leading-[.98] tracking-[-.04em]">Procurement, <span className="text-cyan-300">connected.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">A unified workspace for customers, vendors, and cooperative teams to move every procurement request forward.</p>
        <div className="mt-10 grid grid-cols-3 gap-3">{["Requests","Quotes","Bills"].map((x,i)=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><span className="text-xs font-black text-cyan-300">0{i+1}</span><p className="mt-2 font-bold">{x}</p></div>)}</div>
      </section>
      <motion.section initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-white/10 bg-white/[.07] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-8"><p className="text-sm font-bold text-cyan-300">Secure workspace</p><h2 className="mt-2 text-3xl font-black">Welcome back.</h2><p className="mt-2 text-sm text-slate-400">Sign in to continue your procurement workflow.</p></div>
          {error&&<div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block"><span className="text-sm font-bold text-slate-200">Email</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" placeholder="you@company.com"/></label>
            <label className="block"><span className="text-sm font-bold text-slate-200">Password</span><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" placeholder="••••••••"/></label>
            <button disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3.5 font-black text-slate-950 hover:bg-cyan-200 disabled:opacity-60">{loading?"Authenticating...":<>Enter workspace <ArrowRight size={17} className="transition group-hover:translate-x-1"/></>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-400">Need an account? <Link to="/register" className="font-black text-cyan-300">Create one</Link></p>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={14}/> Role-based secure access</div>
        </div>
      </motion.section>
    </div>
  </div>;
};
export default Login;