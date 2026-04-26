// src/pages/Notifications.tsx
import { useSocial } from "../context/SocialContext";
import { useTheme } from "../context/ThemeContext";
import { FiArrowLeft, FiCheck, FiX, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

export default function Notifications() {
  const { theme } = useTheme();
  const { requests, acceptRequest, rejectRequest, loading } = useSocial();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${theme === "light" ? "bg-[#f8fafc]" : "bg-gray-800 text-white"}`}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div
          className={`p-6 flex items-center gap-4 ${theme === "light" ? "bg-white" : "bg-gray-900"} md:bg-transparent`}
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black tracking-tight uppercase">
            Requests
          </h1>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-center text-slate-400 text-xs font-bold animate-pulse">
              Checking for new signals...
            </p>
          ) : requests.length === 0 ? (
            <div
              className={`mt-20 flex flex-col items-center text-center p-10 rounded-[40px] ${theme === "light" ? "bg-white" : "bg-gray-900"}`}
            >
              <FiUserPlus size={48} className="text-blue-600/20 mb-4" />
              <h2 className="font-bold">All caught up!</h2>
              <p className="text-xs text-slate-400 mt-1">
                No pending chat requests right now.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between p-5 rounded-3xl transition-all shadow-sm ${
                    theme === "light"
                      ? "bg-white border border-slate-100"
                      : "bg-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
                      {req.sender?.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        {req.sender?.full_name}
                      </h3>
                      <p className="text-[10px] text-blue-600 font-black uppercase">
                        Wants to connect
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => rejectRequest(req.id)}
                      className={`p-3 rounded-xl transition-colors ${
                        theme === "light"
                          ? "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          : "bg-gray-800 text-gray-500 hover:bg-red-900/30 hover:text-red-400"
                      }`}
                    >
                      <FiX size={18} />
                    </button>
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-90 transition"
                    >
                      <FiCheck size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav show={true} />
    </div>
  );
}
