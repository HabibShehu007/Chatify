// src/components/BottomNav.tsx
import { FaUserCircle, FaCog, FaUsers, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ 1. Import the hook

interface BottomNavProps {
  show: boolean;
}

export default function BottomNav({ show }: BottomNavProps) {
  const { user, loading } = useUser(); // ✅ 2. Grab user data

  if (!show) return null;

  // ✅ 3. Initials helper (same logic as sidebar)
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
        <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse mb-1" />
      );
    }

    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-7 h-7 rounded-full object-cover mb-1 border border-gray-200 dark:border-blue-700"
        />
      );
    }

    if (user?.fullName) {
      return (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] mb-1 shadow-sm">
          {getInitials(user.fullName)}
        </div>
      );
    }

    return <FaUserCircle className="text-2xl mb-1" />;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-blue-950 border-t border-gray-200 dark:border-blue-800 flex justify-around py-2">
      <Link
        to="/dashboard"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaComments className="text-2xl mb-1" />
        Chat
      </Link>
      <Link
        to="/friends"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaUsers className="text-2xl mb-1" />
        Friends
      </Link>

      {/* ✅ Dynamic Profile Link */}
      <Link
        to="/profile"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        {renderProfileIcon()}
        Profile
      </Link>

      <Link
        to="/settings"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaCog className="text-2xl mb-1" />
        Settings
      </Link>
    </div>
  );
}
