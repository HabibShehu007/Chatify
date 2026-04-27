// src/components/Sidebar.tsx
import {
  FaCog,
  FaUsers,
  FaComments,
  FaUserCircle,
  FaBell,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useSocial } from "../context/SocialContext";
import { useChat } from "../context/ChatContext"; // ✅ IMPORT THIS
import ThemeToggler from "./ThemeToggler";

export default function Sidebar() {
  const { user, loading } = useUser();
  const { requests } = useSocial();
  const { chats } = useChat(); // ✅ GET CHATS
  const location = useLocation();

  // CALCULATE TOTAL UNREAD MESSAGES
  // This tells TypeScript: 'sum' is a number, and 'chat' is an object with an unreadCount
  const totalUnreadMessages = chats.reduce((sum: number, chat: any) => {
    return sum + (chat.unreadCount || 0);
  }, 0);

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
        {/* Chat Link ✅ ADDED UNREAD COUNTER */}
        <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
          <div className="relative">
            <FaComments size={22} />
            {totalUnreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ">
                {totalUnreadMessages}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Chat
          </span>
          {location.pathname === "/dashboard" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>

        {/* Notifications/Requests Bell */}
        <Link to="/notifications" className={getLinkStyle("/notifications")}>
          <div className="relative">
            <FaBell size={22} />
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-950" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Notification
          </span>
        </Link>

        {/* Find Friends Link */}
        <Link to="/friends" className={getLinkStyle("/friends")}>
          <div className="relative">
            <FiSearch size={22} />
            {requests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950 animate-bounce">
                {requests.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Search
          </span>
          {location.pathname === "/friends" && (
            <div className="absolute -left-3 w-1.5 h-8 bg-blue-600 rounded-r-full" />
          )}
        </Link>

        {/* Groups Link */}
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
        <ThemeToggler />
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
