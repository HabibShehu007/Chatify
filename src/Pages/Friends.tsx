// src/pages/Friends.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ThemeToggler from "../components/ThemeToggler";

interface User {
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

const getAvatar = (user: User) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName}
        className="w-16 h-16 rounded-full"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
      {user.fullName.charAt(0)}
    </div>
  );
};

export default function Friends() {
  const [activeTab, setActiveTab] = useState<"requests" | "suggestions">(
    "requests",
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with Theme Toggler */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Find Friends
          </h1>
          <ThemeToggler />
        </div>

        {/* Mobile filter buttons */}
        <div className="md:hidden flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-full ${activeTab === "requests" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Chat Requests
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`px-4 py-2 rounded-full ${activeTab === "suggestions" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Find More Friends
          </button>
        </div>

        {/* Desktop layout: two columns with vertical separator */}
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-300 dark:md:divide-gray-700 gap-6">
          {/* Chat Requests */}
          {(activeTab === "requests" || window.innerWidth >= 768) && (
            <div className="pr-0 md:pr-6">
              <h2 className="text-xl font-semibold mb-4">Chat Requests</h2>
              <div className="grid grid-cols-2 gap-4">
                {chatRequests.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow aspect-square"
                  >
                    {getAvatar(user)}
                    <span className="mt-2 font-medium">{user.fullName}</span>
                    <button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition">
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Find More Friends */}
          {(activeTab === "suggestions" || window.innerWidth >= 768) && (
            <div className="pl-0 md:pl-6">
              <h2 className="text-xl font-semibold mb-4">Find More Friends</h2>
              <div className="grid grid-cols-2 gap-4">
                {suggestedFriends.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow aspect-square"
                  >
                    {getAvatar(user)}
                    <span className="mt-2 font-medium">{user.fullName}</span>
                    <button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition">
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav (mobile only) */}
      <BottomNav show={true} />
    </div>
  );
}
