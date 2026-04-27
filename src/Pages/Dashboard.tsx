import { useTheme } from "../context/ThemeContext";
import { useChat } from "../context/ChatContext";
import { useSocial } from "../context/SocialContext";
import { FaComments, FaBell } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ChatList from "../components/ChatList";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { theme } = useTheme();
  const { activeChat, setActiveChat, chats } = useChat();
  const { requests } = useSocial();

  const EmptyStateUI = ({ title, desc, showButton }: any) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <div
        className={`p-8 rounded-[3rem] ${theme === "light" ? "bg-blue-50" : "bg-blue-900/20"}`}
      >
        <FaComments
          className={`text-6xl ${theme === "light" ? "text-blue-200" : "text-blue-600/40"}`}
        />
      </div>
      <h2 className="font-black text-xl tracking-tight">{title}</h2>
      <p className="text-xs max-w-[220px] text-slate-400">{desc}</p>
      {showButton && (
        <Link
          to="/friends"
          className="mt-2 text-[10px] font-black text-blue-600 uppercase bg-white dark:bg-blue-900/30 px-6 py-3 rounded-2xl shadow-sm border border-blue-100"
        >
          Find Friends
        </Link>
      )}
    </div>
  );

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      // This now correctly calls the Context function
      if (event.key === "Escape") setActiveChat(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setActiveChat]); // Add setActiveChat to dependencies

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${
        theme === "light"
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-gray-950 text-white"
      }`}
    >
      <Sidebar />

      {/* Left Column: Chat List */}
      <div
        className={`flex-1 md:max-w-sm flex flex-col border-r transition-colors ${
          theme === "light"
            ? "bg-white border-slate-200"
            : "bg-gray-900 border-gray-800"
        } ${activeChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">
            Chatify
          </h1>
          <Link
            to="/notifications"
            className="md:hidden relative p-3 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400"
          >
            <FaBell size={18} />
            {requests.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900" />
            )}
          </Link>
        </div>
        <ChatList />
      </div>

      {/* Right Column: Chat View */}
      <div
        className={`flex-1 flex flex-col ${activeChat ? "flex" : "hidden md:flex"} ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-5 border-b flex items-center justify-between ${
                theme === "light"
                  ? "bg-white/80 border-slate-100"
                  : "bg-gray-900/80 border-gray-700"
              } backdrop-blur-md`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-blue-600"
                >
                  <FiArrowLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  {activeChat.name.charAt(0)}
                </div>
                <div>
                  <div className="font-black tracking-tight text-sm">
                    {activeChat.name}
                  </div>
                  <div className="text-[9px] text-green-500 font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
                    Active Now
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className={`flex-1 overflow-y-auto p-6 ${theme === "light" ? "bg-[#fcfdfe]" : "bg-gray-950/30"}`}
            >
              <MessageList />
            </div>

            {/* Input Area */}
            <ChatInput />
          </>
        ) : (
          <div
            className={`hidden md:flex flex-1 items-center justify-center ${theme === "light" ? "bg-slate-50" : "bg-gray-950/50"}`}
          >
            <EmptyStateUI
              title="Secure Communications"
              desc="Select a verified connection to decrypt and view history."
              showButton={chats.length === 0}
            />
          </div>
        )}
      </div>

      <BottomNav show={activeChat === null} />
    </div>
  );
}
