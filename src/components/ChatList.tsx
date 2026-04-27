import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { useTheme } from "../context/ThemeContext";
import { FiSearch } from "react-icons/fi";

export default function ChatList() {
  const { theme } = useTheme();
  const { chats, loading, activeChat, setActiveChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat: any) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="px-6 pb-6">
        <div
          className={`flex items-center rounded-2xl px-4 py-3 transition-all ${
            theme === "light"
              ? "bg-slate-50 border border-slate-300"
              : "bg-blue-950/30"
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
          <div className="p-8 text-center text-slate-400 text-[10px] font-black uppercase animate-pulse">
            Fetching Chats...
          </div>
        ) : (
          filteredChats.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all ${
                activeChat?.id === chat.id
                  ? "bg-blue-600/10 border-r-4 border-blue-600"
                  : "hover:bg-slate-50 dark:hover:bg-gray-800/40 border-r-4 border-transparent"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 uppercase">
                  {chat.name.charAt(0)}
                </div>
                {/* Optional: Online status dot could go here later */}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span
                    className={`font-bold text-sm truncate ${
                      theme === "light" ? "text-slate-800" : "text-white"
                    }`}
                  >
                    {chat.name}
                  </span>

                  {/* DYNAMIC TIME */}
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {chat.lastMessageTime
                      ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                  <p
                    className={`text-xs truncate flex-1 ${
                      theme === "light" ? "text-slate-500" : "text-gray-400"
                    } ${chat.unreadCount > 0 ? "font-bold text-blue-600 dark:text-blue-400" : ""}`}
                  >
                    {chat.lastMessage}
                  </p>

                  {/* UNREAD BUBBLE */}
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-in zoom-in duration-300">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
