import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Modal from "../components/Modal";

export default function Login() {
  const [redirecting, setRedirecting] = useState(false); // ✅ redirect spinner
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ button spinner

  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
          .eq("user_id", userId) // ✅ match user_id column
          .single();

        if (profileError) {
          setModalType("error");
          setModalMessage(
            "Login succeeded but profile fetch failed: " + profileError.message,
          );
          setIsOpen(true);
          setLoading(false);
          return;
        }

        // Success: greet with full_name
        setModalType("success");
        setModalMessage(`Welcome back, ${profile.full_name}!`);
        setIsOpen(true);
      }

      setLoading(false);
    }, 1500); // simulate delay for spinner
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500 ease-in-out bg-white dark:bg-gray-800">
      {/* Left Side (Image) */}
      <div className="hidden md:flex w-1/2">
        <img
          src="boardin4.png"
          alt="Login inspiration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side (Form) */}

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <form
          onSubmit={handleLogin}
          className={`w-full max-w-md space-y-6 rounded-xl shadow-lg p-8 transition-colors duration-500 ease-in-out
          ${theme === "light" ? "bg-white text-black" : "bg-navy-900 text-white"}`}
        >
          <h1 className="text-3xl font-extrabold text-center mb-6">Login</h1>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white shadow-md transition flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (modalType === "success") {
            setRedirecting(true);
            setModalMessage("Redirecting to Dashboard...");
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
