import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import video from "../../assets/login_video.mp4";

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("procurehub-theme");
    return savedMode ? savedMode === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("procurehub-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={darkMode ? "bg-gray-950 text-white transition-colors duration-300" : "bg-gray-50 text-gray-900 transition-colors duration-300"}>
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${darkMode ? "opacity-100" : "opacity-20"}`}
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className={`absolute inset-0 transition-colors duration-500 ${darkMode ? "bg-black/60" : "bg-white/70"}`} />

        <button
          type="button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setDarkMode((prev) => !prev)}
          className={`absolute right-5 top-5 z-30 rounded-full p-2 backdrop-blur transition-all duration-300 hover:scale-105 ${darkMode ? "bg-black/50 text-white hover:bg-black/70" : "bg-white/80 text-gray-800 shadow-md hover:bg-white"}`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <motion.h1
            className={`mb-4 text-5xl font-extrabold tracking-tight transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            Welcome to ProcureHub
          </motion.h1>

          <motion.p
            className={`mb-8 max-w-xl text-xl transition-colors duration-300 ${darkMode ? "text-white/90" : "text-gray-700"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          >
            A futuristic procurement platform for Customers, Vendors, and
            Admins — built for speed, clarity, and control.
          </motion.p>

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className={`rounded-xl border px-6 py-3 backdrop-blur-sm transition ${darkMode ? "border-white/30 bg-white/20 text-white hover:bg-white/30" : "border-gray-300 bg-white/80 text-gray-800 hover:bg-white"}`}
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute bottom-8 transition-colors duration-300 ${darkMode ? "text-white/80" : "text-gray-700"}`}
          >
            <ArrowDown className="h-8 w-8" />
          </motion.div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${darkMode ? "opacity-100" : "opacity-20"}`}
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className={`absolute inset-0 transition-colors duration-500 ${darkMode ? "bg-black/60" : "bg-white/70"}`} />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <h2 className={`mb-6 text-4xl font-bold transition-colors duration-300 md:text-5xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Why ProcureHub?
            </h2>

            <p className={`text-lg leading-relaxed transition-colors duration-300 md:text-xl ${darkMode ? "text-white/90" : "text-gray-700"}`}>
              Real-time request tracking, quote comparison, cooperative
              control — all in one streamlined solution. Designed for
              powerhouses like NTPC and beyond.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
