import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowDown } from "lucide-react";
import video from "../../assets/login_video.mp4";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);


  const toggleDark = () => setDarkMode((prev) => !prev);

  return (
    <div
  className={`relative min-h-screen overflow-hidden ${
    darkMode ? "bg-black text-white" : "bg-white text-gray-900"
  }`}
>
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* 💡 Animated Light Flare Overlay */}
<div
  className={`absolute inset-0 bg-gradient-to-br from-transparent ${
    darkMode ? "via-white/10 to-white/5" : "via-blue-100/20 to-white/20"
  } animate-pulse z-10 pointer-events-none`}
/>
      {/* 🌘 Dark Mode Toggle */}
      <button
        className="absolute top-5 right-5 z-30 bg-black/50 text-white rounded-full p-2 backdrop-blur hover:scale-105 transition"
        onClick={toggleDark}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* 💎 Hero Overlay Without Logo */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 bg-black/60 backdrop-blur-sm text-white text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-4 tracking-tight"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Welcome to ProcureHub
        </motion.h1>

        <motion.p
          className="text-xl max-w-xl mb-8 text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          A futuristic procurement platform for Customers, Vendors, and Admins —
          built for speed, clarity, and control.
        </motion.p>

        <motion.div
          className="flex gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="bg-white/20 border border-white/30 px-6 py-3 rounded-xl backdrop-blur-sm text-white transition"
          >
            Learn More
          </Link>
        </motion.div>

        {/* 🚀 Scroll Down Hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 text-white/80"
        >
          <ArrowDown className="w-8 h-8" />
        </motion.div>
      </div>

      {/* 🌍 Scroll Reveal Below-the-Fold */}
      <motion.div
        className="min-h-screen flex flex-col justify-center items-center px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: [40, 0] }}
        transition={{ duration: 1.2 }}
      >
         
         <h2
  className={`text-4xl font-bold mb-4 ${
    darkMode ? "text-white" : "text-gray-900"
  }`}
>
          Why ProcureHub?
        </h2>
         <p
  className={`max-w-2xl text-lg ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`}
>
          Real-time request tracking, quote comparison, cooperative control —
          all in one streamlined solution. Designed for powerhouses like NTPC
          and beyond.
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
