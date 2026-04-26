// src/components/Sidebar.tsx
import { FaCog, FaUsers, FaComments, FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import ThemeToggler from "./ThemeToggler"; // ✅ Integrated the toggler

export default function Sidebar() {
  const { user, loading } = useUser();
  const location = useLocation();

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return `relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
    }`;
  };

  const renderProfileIcon = () => {
    const isActive = location.pathname === "/profile";
    if (loading)
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      );

    return (
      <div
        className={`p-1 rounded-full transition-all border-2 ${
          isActive ? "border-blue-600 scale-110" : "border-transparent"
        }`}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            {user?.fullName ? (
              getInitials(user.fullName)
            ) : (
              <FaUserCircle size={24} />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden md:flex w-20 flex-col justify-between items-center py-8 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      {/* Top Section: Navigation */}
      <div className="flex flex-col items-center space-y-6 w-full">
        {/* Chat Link */}
        <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
          <FaComments size={22} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Chat
          </span>
          {location.pathname === "/dashboard" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>

        {/* Find Friends (Search) Link ✅ Updated Icon */}
        <Link to="/friends" className={getLinkStyle("/friends")}>
          <FiSearch size={22} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Search
          </span>
          {location.pathname === "/friends" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>

        {/* Groups Link ✅ Updated Icon */}
        <Link to="/groups" className={getLinkStyle("/groups")}>
          <FaUsers size={22} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Groups
          </span>
          {location.pathname === "/groups" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>

        {/* Settings Link */}
        <Link to="/settings" className={getLinkStyle("/settings")}>
          <FaCog size={22} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Config
          </span>
          {location.pathname === "/settings" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>
      </div>

      {/* Bottom Section: Theme & Profile */}
      <div className="flex flex-col items-center space-y-6">
        <ThemeToggler />{" "}
        {/* ✅ Fixes the "not working" issue by giving it a permanent home */}
        <Link
          to="/profile"
          className="flex flex-col items-center transition-transform active:scale-90"
        >
          {renderProfileIcon()}
          <span
            className={`text-[10px] font-bold mt-2 uppercase ${
              location.pathname === "/profile"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            Me
          </span>
        </Link>
      </div>
    </div>
  );
}
