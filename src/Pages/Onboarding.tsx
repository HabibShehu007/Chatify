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
    }, 4000); // change every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt="Onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-navy-900/80 to-black/90"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-4xl sm:text-6xl font-extrabold text-white mb-6"
        >
          Welcome to Chatify
        </motion.h1>
        <motion.p
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-gray-200 sm:text-lg mb-10 leading-relaxed"
        >
          Connect instantly with friends and colleagues. Fast, secure, and
          reliable messaging.
        </motion.p>

        <div className="flex gap-6 justify-center">
          <Link
            to="/signup"
            className="relative rounded-full px-6 py-3 font-bold shadow-md overflow-hidden group"
          >
            <span className="absolute inset-0 bg-teal-500 transition-transform duration-500 group-hover:translate-y-0 translate-y-full"></span>
            <span className="relative text-white">Sign Up</span>
          </Link>

          <Link
            to="/login"
            className="relative rounded-full px-6 py-3 font-bold shadow-md flex items-center gap-2 overflow-hidden group bg-white text-navy-900"
          >
            <span className="absolute inset-0 bg-navy-900 transition-transform duration-500 group-hover:translate-y-0 translate-y-full"></span>
            <span className="relative flex items-center gap-2">
              Login <FaArrowRight className="text-sm" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
