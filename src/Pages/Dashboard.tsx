// src/pages/Dashboard.tsx
import { useState, useEffect } from "react"; // ✅ Added useEffect
import { useTheme } from "../context/ThemeContext";
import {
  FaPaperclip,
  FaMicrophone,
  FaPaperPlane,
  FaComments,
} from "react-icons/fa";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

export default function Dashboard() {
  const { theme } = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mock data - set to empty array [] to test the "Global" empty state
  const chats = [
    {
      id: "1",
      name: "Alice",
      lastMessage: "Hey, how are you?",
      time: "10:45",
      avatar: null,
    },
    {
      id: "2",
      name: "Bob",
      lastMessage: "Let’s meet tomorrow.",
      time: "09:30",
      avatar: null,
    },
  ];

  // ✅ Handle ESC key to deselect chat (Desktop only feel)
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedChat(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const getAvatar = (chat: any) => (
    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
      {chat?.name?.charAt(0)}
    </div>
  );

  const activeChat = chats.find((c) => c.id === selectedChat);
  const isChatListEmpty = chats.length === 0;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        theme === "light"
          ? "bg-gray-50 text-gray-800"
          : "bg-gray-950 text-white"
      }`}
    >
      <Sidebar />

      {/* Chat List Section */}
      <div
        className={`flex-1 md:max-w-sm flex flex-col border-r ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-900 border-gray-800"
        } ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            Chatify
          </h1>
        </div>

        <div className="px-4 pb-4">
          <div
            className={`flex items-center rounded-2xl px-4 py-2.5 ${
              theme === "light" ? "bg-gray-100" : "bg-blue-950/40"
            }`}
          >
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent focus:outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isChatListEmpty ? (
            /* ✅ Mobile/Desktop: Show this ONLY if there are 0 chats total */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <FiSearch className="text-4xl text-blue-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                No conversations yet. Tap the Search icon to find friends!
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition ${
                  selectedChat === chat.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/40 border-l-4 border-transparent"
                }`}
              >
                {getAvatar(chat)}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold truncate">{chat.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inbox Section */}
      <div
        className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden md:flex"} ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        {selectedChat ? (
          <>
            {/* Active Chat Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                theme === "light"
                  ? "border-gray-200 bg-white"
                  : "border-gray-700 bg-gray-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  className="md:hidden"
                  onClick={() => setSelectedChat(null)}
                >
                  <FiArrowLeft className="text-2xl" />
                </button>
                {getAvatar(activeChat)}
                <div className="flex flex-col text-left">
                  <span className="font-bold leading-tight">
                    {activeChat?.name}
                  </span>
                  <span className="text-[10px] text-green-500 font-bold uppercase">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {/* Messages */}
            </div>

            {/* Input Bar */}
            <div
              className={`p-4 ${theme === "light" ? "bg-white" : "bg-gray-900"}`}
            >
              <div
                className={`flex items-center gap-3 p-2 px-4 rounded-2xl ${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}
              >
                <FaPaperclip className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                />
                <button className="bg-blue-600 text-white p-2.5 rounded-xl">
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ✅ Desktop Empty State (SelectedChat is null) */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center space-y-4 px-6 text-center bg-gray-50 dark:bg-gray-950/50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
              <FaComments className="text-6xl text-blue-600/20 mb-4" />
              <h2 className="text-xl font-bold">
                {isChatListEmpty
                  ? "Start a Conversation"
                  : "Chatify for Desktop"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                {isChatListEmpty
                  ? "Tap the search icon in the sidebar to find friends and start messaging."
                  : "Select a chat from your list to begin a conversation. Press 'Esc' to close a chat."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav - Only show if no chat is open */}
      <BottomNav show={selectedChat === null} />
    </div>
  );
}
