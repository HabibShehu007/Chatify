import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
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
  const [loading, setLoading] = useState(false); // button spinner
  const [isOpen, setIsOpen] = useState(false); // modal open/close
  const [redirecting, setRedirecting] = useState(false); // modal spinner
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordStrength = () => {
    const pwd = form.password;

    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length < 6) return "Weak";

    if (hasLetter && hasNumber && hasSpecial) {
      return "Strong";
    }

    if (
      (hasLetter && hasNumber) ||
      (hasLetter && hasSpecial) ||
      (hasNumber && hasSpecial)
    ) {
      return "Medium";
    }

    return "Weak";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setModalType("error");
      setModalMessage(error.message);
      setIsOpen(true);
    } else {
      // Insert profile data
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

      if (profileError) {
        setModalType("error");
        setModalMessage(
          "Signup succeeded but profile insert failed: " + profileError.message,
        );
        setIsOpen(true);
      } else {
        setModalType("success");
        setModalMessage("Signup successful! Please login to continue.");
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500 ease-in-out bg-white dark:bg-gray-800">
      {/* Left Side (Image) */}
      <div className="hidden md:flex w-1/2">
        <img
          src="signup-hero.png" // your chosen image
          alt="Inspiring user"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side (Form) */}

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <form
          onSubmit={handleSignup}
          className={`w-full max-w-md space-y-6 rounded-xl shadow-lg p-8 transition-colors duration-500 ease-in-out
          ${theme === "light" ? "bg-white text-black" : "bg-navy-900 text-white"}`}
        >
          <h1 className="text-3xl font-extrabold text-center mb-6">
            Create Account
          </h1>

          {/* Example Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className={`peer w-full pl-10 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
              ${theme === "light" ? "border-blue-400 focus:ring-blue-500" : "border-blue-600 focus:ring-blue-400"} 
              bg-transparent`}
            />
            <label
              className="absolute left-10 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Full Name
            </label>
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`peer w-full pl-10 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
              ${theme === "light" ? "border-blue-400 focus:ring-blue-500" : "border-blue-600 focus:ring-blue-400"} 
              bg-transparent`}
            />
            <label
              className="absolute left-10 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <FaPhone className="absolute left-3 top-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={`peer w-full pl-10 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
              ${theme === "light" ? "border-blue-400 focus:ring-blue-500" : "border-blue-600 focus:ring-blue-400"} 
              bg-transparent`}
            />
            <label
              className="absolute left-10 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Phone Number
            </label>
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`peer w-full pl-10 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
              ${theme === "light" ? "border-blue-400 focus:ring-blue-500" : "border-blue-600 focus:ring-blue-400"} 
              bg-transparent`}
            />
            <label
              className="absolute left-10 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-grey-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {/* Password Strength Bar */}
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-300 rounded">
              <div
                className={`h-2 rounded transition-all duration-500 ease-in-out
        ${passwordStrength() === "Weak" ? "bg-red-500 w-1/3" : ""}
        ${passwordStrength() === "Medium" ? "bg-orange-500 w-2/3" : ""}
        ${passwordStrength() === "Strong" ? "bg-green-500 w-full" : ""}`}
              ></div>
            </div>
            <p className="text-sm mt-1">
              Password Strength:{" "}
              <span
                className={
                  passwordStrength() === "Strong"
                    ? "text-green-600 font-semibold"
                    : passwordStrength() === "Medium"
                      ? "text-orange-600 font-semibold"
                      : "text-red-600 font-semibold"
                }
              >
                {passwordStrength()}
              </span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md py-3 font-bold shadow-md bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-300 hover:scale-105 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm text-white"></span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
        {/* Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => {
            if (modalType === "success") {
              setRedirecting(true);
              setModalMessage("Redirecting to Login...");
              setTimeout(() => {
                setRedirecting(false);
                navigate("/login"); // ✅ signup redirects to login
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
    </div>
  );
}
