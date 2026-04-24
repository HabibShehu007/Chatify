// src/components/Sidebar.tsx
import { FaCog, FaUsers, FaComments, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Sidebar() {
  const { user, loading } = useUser();

  // ✅ Helper to get initials (e.g., "Habib Shehu" -> "HS")
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const renderProfileIcon = () => {
    if (loading) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      );
    }

    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
      );
    }

    if (user?.fullName) {
      return (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {/* ✅ Now using the initials helper */}
          {getInitials(user.fullName)}
        </div>
      );
    }

    return <FaUserCircle className="text-4xl text-gray-400" />;
  };

  return (
    <div className="hidden md:flex w-20 flex-col justify-between border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center space-y-6 mt-6">
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaComments className="text-2xl mb-1" />
          Chat
        </Link>
        <Link
          to="/friends"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaUsers className="text-2xl mb-1" />
          Friends
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaCog className="text-2xl mb-1" />
          Settings
        </Link>
      </div>

      <Link
        to="/profile"
        className="p-4 mb-4 cursor-pointer hover:opacity-80 flex justify-center transition"
      >
        {renderProfileIcon()}
      </Link>
    </div>
  );
}
