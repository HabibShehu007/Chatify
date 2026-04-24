// src/pages/Profile.tsx
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ThemeToggler from "../components/ThemeToggler";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaCamera } from "react-icons/fa";

export default function Profile() {
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const getAvatar = () => {
    if (user?.avatar) {
      return (
        <div className="relative group">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-xl"
          />
          <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition">
            <FaCamera className="text-white text-sm" />
          </div>
        </div>
      );
    }
    return (
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-blue-600">
          {user?.fullName ? getInitials(user.fullName) : "?"}
        </div>
        <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition">
          <FaCamera className="text-white text-sm" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        theme === "light"
          ? "bg-gray-50 text-gray-800"
          : "bg-gray-800 text-white"
      }`}
    >
      {/* Sidebar now inherits the correct theme color (gray-800 in light, white in dark) */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-6 flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
          <ThemeToggler />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          {/* FORCE WHITE TEXT HERE: 
              We add 'text-white' to this div so ONLY the card is affected.
              We also use 'bg-gray-900' for both themes so white text is always visible.
          */}
          <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="h-24 bg-blue-600 w-full"></div>

            <div className="px-8 pb-8">
              <div className="flex justify-center -mt-16 mb-4">
                {getAvatar()}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold italic tracking-tight">
                  {user?.fullName}
                </h2>
                <p className="text-blue-400 font-medium">
                  @{user?.username || "username"}
                </p>
              </div>

              <div className="space-y-4 bg-gray-800/50 p-6 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaEnvelope className="text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Email
                    </span>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-900/30 rounded-lg">
                      <FaPhone className="text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Phone
                      </span>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaCalendarAlt className="text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Member Since
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(user?.createdAt || "").toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-95">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav show={true} />
    </div>
  );
}
