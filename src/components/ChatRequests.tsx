// src/components/ChatRequests.tsx
import FriendCard from "./FriendCard";
import type { User } from "../types/User";
import { useTheme } from "../context/ThemeContext"; // ✅ Import this to be 100% sure

interface ChatRequestsProps {
  users: User[];
  search: string;
}

export default function ChatRequests({ users, search }: ChatRequestsProps) {
  const { theme } = useTheme(); // ✅ Get the actual theme state
  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="py-6 border-b border-gray-200 dark:border-gray-800 mb-8">
      <div className="flex items-center justify-between mb-6 px-2">
        {/* ✅ We use a template literal to force the color based on the theme state */}
        <h2
          className={`text-xl font-black tracking-tight ${
            theme === "light" ? "text-gray-950" : "text-white"
          }`}
        >
          Chat Requests
        </h2>

        {filtered.length > 0 && (
          <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg shadow-red-500/20">
            {filtered.length} NEW
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((user) => (
          <FriendCard
            key={user.id}
            user={user}
            actionLabel="Accept Chat"
            onAction={() => console.log("Accepted", user.fullName)}
          />
        ))}
      </div>
    </div>
  );
}
