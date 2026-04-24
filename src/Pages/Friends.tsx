// src/pages/Friends.tsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ThemeToggler from "../components/ThemeToggler";
import ChatRequests from "../components/ChatRequests";
import FindMoreFriends from "../components/FindMoreFriends";
import { FiSearch } from "react-icons/fi";

export interface User {
  id: string;
  fullName: string;
  avatar?: string | null;
}

const chatRequests: User[] = [
  { id: "1", fullName: "Alice Johnson", avatar: null },
  { id: "2", fullName: "Bob Smith", avatar: null },
];

const suggestedFriends: User[] = [
  { id: "3", fullName: "Charlie Brown", avatar: null },
  { id: "4", fullName: "Diana Prince", avatar: null },
  { id: "5", fullName: "Ethan Hunt", avatar: null },
];

export default function Friends() {
  const [activeTab, setActiveTab] = useState<"requests" | "suggestions">(
    "requests",
  );
  const [search, setSearch] = useState("");
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        theme === "light"
          ? "bg-gray-50 text-gray-800"
          : "bg-gray-900 text-white"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Find Friends
          </h1>
          <ThemeToggler />
        </div>

        {/* Search bar */}
        <div className="flex items-center mb-6 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 shadow-sm">
          <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none dark:text-white"
          />
        </div>

        {/* Mobile filter buttons */}
        <div className="md:hidden flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "requests"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Chat Requests
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "suggestions"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Find More Friends
          </button>
        </div>

        {/* Desktop layout */}
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-300 dark:md:divide-gray-700 gap-6">
          {(activeTab === "requests" || window.innerWidth >= 768) && (
            <div className="pr-0 md:pr-6">
              <ChatRequests users={chatRequests} search={search} />
            </div>
          )}
          {(activeTab === "suggestions" || window.innerWidth >= 768) && (
            <div className="pl-0 md:pl-6">
              <FindMoreFriends users={suggestedFriends} search={search} />
            </div>
          )}
        </div>
      </div>

      <BottomNav show={true} />
    </div>
  );
}
