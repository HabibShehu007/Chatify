// src/components/BottomNav.tsx
import { FaUserCircle, FaCog, FaUsers, FaComments } from "react-icons/fa";
import { FiSearch } from "react-icons/fi"; // ✅ Added for Search/Friends
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface BottomNavProps {
  show: boolean;
}

export default function BottomNav({ show }: BottomNavProps) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (!show) return null;

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return `relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 ${
      isActive ? "text-blue-600 scale-110" : "text-gray-500 dark:text-gray-400"
    }`;
  };

  const renderProfileIcon = () => {
    const isActive = location.pathname === "/profile";
    if (loading)
      return (
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse mb-1" />
      );

    return (
      <div
        className={`p-0.5 rounded-full transition-all border-2 ${
          isActive ? "border-blue-600" : "border-transparent"
        }`}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-6 h-6 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[8px]">
            {user?.fullName ? getInitials(user.fullName) : <FaUserCircle />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {/* Chat */}
      <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
        <FaComments className="text-xl" />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
          Chat
        </span>
        {location.pathname === "/dashboard" && (
          <div className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>

      {/* Friends/Search ✅ Updated Icon to FiSearch */}
      <Link to="/friends" className={getLinkStyle("/friends")}>
        <FiSearch className="text-xl" />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
          Search
        </span>
        {location.pathname === "/friends" && (
          <div className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>

      {/* Groups ✅ Added Groups Link with FaUsers */}
      <Link to="/groups" className={getLinkStyle("/groups")}>
        <FaUsers className="text-xl" />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
          Groups
        </span>
        {location.pathname === "/groups" && (
          <div className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>

      {/* Profile */}
      <Link to="/profile" className={getLinkStyle("/profile")}>
        {renderProfileIcon()}
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          Me
        </span>
        {location.pathname === "/profile" && (
          <div className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>

      {/* Settings */}
      <Link to="/settings" className={getLinkStyle("/settings")}>
        <FaCog className="text-xl" />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
          Config
        </span>
        {location.pathname === "/settings" && (
          <div className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>
    </div>
  );
}
