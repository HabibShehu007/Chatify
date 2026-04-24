// src/pages/Dashboard.tsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaComments, FaPaperclip, FaMicrophone } from "react-icons/fa";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import ThemeToggler from "../components/ThemeToggler";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

export default function Dashboard() {
  const { theme } = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const chats = [
    {
      id: "1",
      name: "Alice",
      lastMessage: "Hey, how are you?",
      time: "10:45",
      unread: 2,
      avatar: null,
    },
    {
      id: "2",
      name: "Bob",
      lastMessage: "Let’s meet tomorrow.",
      time: "09:30",
      unread: 0,
      avatar: null,
    },
    {
      id: "3",
      name: "Charlie",
      lastMessage: "Got the files.",
      time: "Yesterday",
      unread: 5,
      avatar: null,
    },
  ];

  const getAvatar = (chat: any) => {
    if (chat?.avatar) {
      return (
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {chat?.name?.charAt(0)}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${theme === "light" ? "bg-white" : "bg-gray-800 text-white"}`}
    >
      {/* Left Sidebar (desktop only) */}
      <Sidebar />

      {/* Chat List (desktop) */}
      <div
        className={`flex-1 flex flex-col ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Chatify
          </h1>
          <ThemeToggler />
        </div>

        {/* Search bar */}
        <div className="p-3 flex items-center">
          <div className="flex items-center w-full bg-gray-100 dark:bg-blue-950 rounded-full px-3 py-2 shadow-sm">
            <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="flex-1 bg-transparent focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-around p-2 text-sm">
          {["All", "Unread", "Favourites", "Groups"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center justify-between p-4 cursor-pointer transition ${
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-blue-900/40"
              } ${selectedChat === chat.id ? "bg-gray-200 dark:bg-blue-800" : ""}`}
            >
              <div className="flex items-center space-x-3">
                {getAvatar(chat)}
                <div>
                  <div className="font-semibold">{chat.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{chat.time}</div>
                {chat.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inbox */}
      <div
        className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden md:flex"}`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center space-x-3 p-4">
              <button
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <FiArrowLeft className="text-2xl" />
              </button>
              {getAvatar(chats.find((c) => c.id === selectedChat))}
              <span className="font-bold">
                {chats.find((c) => c.id === selectedChat)?.name}
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div>
                <span className="bg-blue-600 text-black dark:text-white px-3 py-2 rounded-lg inline-block">
                  Hello! This is a sample message.
                </span>
              </div>
              <div className="text-right">
                <span className="bg-blue-300 text-black dark:text-white px-3 py-2 rounded-lg inline-block">
                  Hi, nice to chat with you!
                </span>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 flex items-center space-x-3">
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                <FaPaperclip className="text-xl" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-3 py-2 focus:outline-none dark:bg-blue-950 dark:text-white"
              />
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                <FaMicrophone className="text-xl" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-full">
              <FaComments className="text-blue-600 dark:text-blue-400 text-6xl" />
            </div>
            <h2 className="text-xl font-bold">Welcome to Chatify</h2>
            <p className="text-center max-w-md">
              Select a conversation from the chat list to start messaging. Your
              chats will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav (mobile only, only on chat list) */}
      <BottomNav show={selectedChat === null} />
    </div>
  );
}
