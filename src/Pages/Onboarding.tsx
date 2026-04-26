// src/pages/Onboarding.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const images = [
  "onboarding1.png",
  "onboarding2.png",
  "onboarding3.png",
  "onboarding4.png",
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Increased slightly for a more relaxed feel
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={images[index]}
            src={images[index]}
            alt="Onboarding Background"
            // Ultra-smooth cross-fade + slight scale-up (Ken Burns effect)
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Modern Gradient Overlay */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-blue-950/40 to-black/90`}
      />

      {/* Content Area */}
      <div className="relative z-20 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter">
            CHATIFY <span className="text-blue-500">.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg mb-10 leading-relaxed max-w-xl mx-auto font-medium">
            The next generation of secure messaging. Experience
            <span className="text-white"> zero-latency </span> communication
            designed for the modern web.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="w-full sm:w-auto min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 font-black shadow-2xl shadow-blue-600/30 transition-all active:scale-95 text-center"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto min-w-[160px] bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-2xl px-8 py-4 font-black transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              Sign In{" "}
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Progress Dots */}
        <div className="absolute bottom-[-100px] left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === i ? "w-8 bg-blue-500" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
