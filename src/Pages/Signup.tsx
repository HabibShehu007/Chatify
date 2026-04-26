// src/pages/Signup.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ThemeToggler from "../components/ThemeToggler";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaAt,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { label: "Empty", color: "bg-slate-200", width: "w-0" };
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length < 6)
      return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (hasLetter && hasNumber && hasSpecial)
      return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Medium", color: "bg-orange-500", width: "w-2/3" };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setModalType("error");
      setModalMessage(error.message);
      setIsOpen(true);
      setLoading(false);
    } else {
      const { error: profileError } = await supabase
        .from("user_profile")
        .insert([
          {
            user_id: data.user?.id,
            full_name: form.fullName,
            username: form.username,
            phone: form.phone,
          },
        ]);

      setLoading(false);
      if (profileError) {
        setModalType("error");
        setModalMessage("Profile creation failed: " + profileError.message);
      } else {
        setModalType("success");
        setModalMessage("Account created! Redirecting to login...");
      }
      setIsOpen(true);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${theme === "light" ? "bg-[#f8fafc]" : "bg-gray-800"}`}
    >
      {/* Theme Toggler - Positioned Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggler />
      </div>

      {/* Left Side (Branding/Hero) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="signup-hero.png"
          alt="Chatify Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-transparent backdrop-blur-[2px]" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-black tracking-tighter">
            JOIN THE NETWORK.
          </h2>
          <p className="text-white/80 font-medium">Safe. Fast. Minimalist.</p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div
          className={`w-full max-w-md p-8 rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-blue-600/5 
          ${theme === "light" ? "bg-white border border-slate-100" : "bg-gray-900 border border-gray-800 text-white"}`}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-blue-600">
              Chatify
            </h1>
            <p
              className={`text-xs font-bold uppercase tracking-widest mt-2 ${theme === "light" ? "text-slate-400" : "text-gray-500"}`}
            >
              Create your secure identity
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Username */}
            <div className="relative group">
              <FaAt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Phone */}
            <div className="relative group">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border outline-none transition-all text-sm font-medium
                  ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400"
                      : "bg-gray-800 border-gray-700 focus:border-blue-500"
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

            {/* Password Strength */}
            {form.password && (
              <div className="px-2">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${strength.color} ${strength.width}`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Security
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase ${strength.label === "Strong" ? "text-green-500" : strength.label === "Medium" ? "text-orange-500" : "text-red-500"}`}
                  >
                    {strength.label}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          <p
            className={`mt-8 text-center text-xs font-bold ${theme === "light" ? "text-slate-400" : "text-gray-500"}`}
          >
            ALREADY PART OF THE LOOP?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              LOGIN HERE
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
              navigate("/login");
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
