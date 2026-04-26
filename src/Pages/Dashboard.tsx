// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useChat } from "../context/ChatContext";
import { useSocial } from "../context/SocialContext";
import { FaPaperclip, FaPaperPlane, FaComments, FaBell } from "react-icons/fa";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { theme } = useTheme();
  const chatContext = useChat();
  const socialContext = useSocial();

  const chats = chatContext?.chats || [];
  const loading = chatContext?.loading || false;
  const requests = socialContext?.requests || [];

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat: any) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedChat(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const activeChat = chats.find((c: any) => c.id === selectedChat);
  const isChatListEmpty = chats.length === 0;

  const EmptyStateUI = ({ title, desc }: { title: string; desc: string }) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <div
        className={`p-8 rounded-[3rem] transition-colors ${theme === "light" ? "bg-blue-50 shadow-inner" : "bg-blue-900/20"}`}
      >
        <FaComments
          className={`text-6xl ${theme === "light" ? "text-blue-200" : "text-blue-600/40"}`}
        />
      </div>
      <h2 className="font-black text-xl tracking-tight">{title}</h2>
      <p
        className={`text-xs max-w-[220px] leading-relaxed ${theme === "light" ? "text-slate-400" : "text-gray-500"}`}
      >
        {desc}
      </p>
      {isChatListEmpty && (
        <Link
          to="/friends"
          className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white dark:bg-blue-900/30 px-6 py-3 rounded-2xl shadow-sm border border-blue-100 dark:border-transparent active:scale-95 transition"
        >
          Find Friends
        </Link>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${
        theme === "light"
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-gray-950 text-white"
      }`}
    >
      <Sidebar />

      {/* Chat List Section */}
      <div
        className={`flex-1 md:max-w-sm flex flex-col border-r transition-colors ${
          theme === "light"
            ? "bg-white border-slate-200"
            : "bg-gray-900 border-gray-800"
        } ${selectedChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">
            Chatify
          </h1>
          <Link
            to="/notifications"
            className={`md:hidden relative p-3 rounded-2xl transition-colors ${
              theme === "light"
                ? "bg-slate-100 text-slate-500"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            <FaBell size={18} />
            {requests.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900" />
            )}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-6">
          <div
            className={`flex items-center rounded-2xl px-4 py-3 transition-all ${
              theme === "light"
                ? "bg-slate-50 border border-slate-300 focus-within:border-blue-200 focus-within:bg-white focus-within:shadow-sm"
                : "bg-blue-950/30 focus-within:bg-blue-950/50"
            }`}
          >
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none w-full text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Fetching Signal...
            </div>
          ) : isChatListEmpty ? (
            <div className="h-full py-10 opacity-60">
              <EmptyStateUI
                title="Empty Inbox"
                desc="Your chat history is clear. Ready to start a new loop?"
              />
            </div>
          ) : (
            filteredChats.map((chat: any) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all ${
                  selectedChat === chat.id
                    ? theme === "light"
                      ? "bg-blue-50/50 border-r-4 border-blue-600 shadow-sm"
                      : "bg-blue-900/20 border-r-4 border-blue-600"
                    : theme === "light"
                      ? "hover:bg-slate-50 border-r-4 border-transparent"
                      : "hover:bg-gray-800/40 border-r-4 border-transparent"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 uppercase">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-800" : "text-white"}`}
                    >
                      {chat.name}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      12:45 PM
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${theme === "light" ? "text-slate-500" : "text-gray-400"}`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inbox View */}
      <div
        className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden md:flex"} transition-colors duration-300 ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        {selectedChat ? (
          <>
            <div
              className={`p-5 border-b flex items-center justify-between transition-colors ${
                theme === "light"
                  ? "bg-white/80 backdrop-blur-md border-slate-100"
                  : "bg-gray-900/80 backdrop-blur-md border-gray-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-blue-600 transition"
                >
                  <FiArrowLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {activeChat?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-black tracking-tight text-sm">
                    {activeChat?.name}
                  </div>
                  <div className="text-[9px] text-green-500 font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Active Now
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex-1 overflow-y-auto p-6 transition-colors ${theme === "light" ? "bg-[#fcfdfe]" : "bg-gray-950/30"}`}
            >
              {/* Messages map here */}
            </div>

            <div
              className={`p-6 ${theme === "light" ? "bg-white border-t border-slate-100" : "bg-gray-900"}`}
            >
              <div
                className={`flex items-center gap-3 p-2 px-4 rounded-[1.5rem] transition-all ${
                  theme === "light"
                    ? "bg-slate-100 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-600/5 focus-within:ring-1 focus-within:ring-blue-100"
                    : "bg-gray-800"
                }`}
              >
                <FaPaperclip className="text-slate-400 cursor-pointer hover:text-blue-600 transition" />
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-transparent focus:outline-none text-sm py-2 font-medium"
                />
                <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-90 transition-transform">
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`hidden md:flex flex-1 items-center justify-center transition-colors ${theme === "light" ? "bg-slate-50" : "bg-gray-950/50"}`}
          >
            <EmptyStateUI
              title="Secure Communications"
              desc="Select a verified connection to decrypt and view your message history."
            />
          </div>
        )}
      </div>

      <BottomNav show={selectedChat === null} />
    </div>
  );
}
