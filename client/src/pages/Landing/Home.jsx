import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun, ArrowDown } from "lucide-react";
import { useState } from "react";
import video from "../../assets/login_video.mp4";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "text-white" : "text-gray-900"}>

      {/* ================= FIRST SECTION ================= */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="absolute top-5 right-5 z-30 bg-black/50 text-white rounded-full p-2 backdrop-blur hover:scale-105 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">

          <motion.h1
            className="text-5xl font-extrabold mb-4 tracking-tight text-white"
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

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 text-white/80"
          >
            <ArrowDown className="w-8 h-8" />
          </motion.div>

        </div>
      </section>


      {/* ================= SECOND SECTION ================= */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Background Video Again */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Second Section Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why ProcureHub?
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-white/90">
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