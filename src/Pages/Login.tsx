// src/pages/Login.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Modal from "../components/Modal";
import ThemeToggler from "../components/ThemeToggler";

export default function Login() {
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Keeping your logic but wrapping in the new UI
    setTimeout(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setModalType("error");
        setModalMessage(error.message);
        setIsOpen(true);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profile")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileError) {
          setModalType("error");
          setModalMessage("Login success, but profile fetch failed.");
          setIsOpen(true);
          setLoading(false);
          return;
        }

        setModalType("success");
        setModalMessage(`Welcome back, ${profile.full_name}!`);
        setIsOpen(true);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${theme === "light" ? "bg-[#f8fafc]" : "bg-gray-800"}`}
    >
      {/* Theme Toggler */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggler />
      </div>

      {/* Left Side (Hero Image) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="boardin4.png"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-black/60 backdrop-blur-[1px]" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-black tracking-tighter italic">
            WELCOME BACK.
          </h2>
          <p className="text-white/70 font-medium tracking-wide">
            Your conversations are waiting.
          </p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div
          className={`w-full max-w-md p-10 rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-blue-600/5 
          ${theme === "light" ? "bg-white border border-slate-100" : "bg-gray-900 border border-gray-800 text-white"}`}
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-blue-600">
              Chatify
            </h1>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${theme === "light" ? "text-slate-400" : "text-gray-500"}`}
            >
              Secure Authorization
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400 shadow-inner"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500 shadow-lg"
                  }`}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-12 pr-12 py-4 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400 shadow-inner"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500 shadow-lg"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 mt-4"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <p
            className={`mt-10 text-center text-[10px] font-bold ${theme === "light" ? "text-slate-400" : "text-gray-500"}`}
          >
            NEW TO THE PLATFORM?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline tracking-widest font-black"
            >
              SIGN UP
            </Link>
          </p>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (modalType === "success") {
            setRedirecting(true);
            setTimeout(() => {
              setRedirecting(false);
              navigate("/dashboard");
            }, 1000);
          } else {
            setIsOpen(false);
          }
        }}
        type={modalType}
        message={modalMessage}
        showSpinner={redirecting}
      />
    </div>
  );
}
