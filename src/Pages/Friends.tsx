// src/pages/Friends.tsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ThemeToggler from "../components/ThemeToggler";
import FindMoreFriends from "../components/FindMoreFriends"; // This is your discovery component
import { FiSearch, FiUsers } from "react-icons/fi";

export default function Friends() {
  const [search, setSearch] = useState("");
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${
        theme === "light"
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-gray-800 text-white"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                Discovery
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Find your next connection
              </p>
            </div>
          </div>
          <ThemeToggler />
        </div>

        {/* Search Bar - Stylized to match Dashboard */}
        <div className="mb-10">
          <div
            className={`flex items-center rounded-[2rem] px-6 py-4 transition-all ${
              theme === "light"
                ? "bg-white border border-slate-100 shadow-sm focus-within:shadow-md focus-within:border-blue-200"
                : "bg-gray-900 border border-gray-800 focus-within:border-blue-900"
            }`}
          >
            <FiSearch className="text-slate-400 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Discovery Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Suggested for you
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-gray-800 ml-4"></div>
          </div>

          {/* ✅ This component now handles the full width.
             Make sure inside FindMoreFriends you filter based on the 'search' prop.
          */}
          <div className="min-h-[400px]">
            <FindMoreFriends search={search} />
          </div>
        </div>
      </div>

      {/* Show BottomNav on mobile when no specific chat is open */}
      <BottomNav show={true} />
    </div>
  );
}
