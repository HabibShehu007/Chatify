// src/components/FindMoreFriends.tsx
import FriendCard from "./FriendCard";
import type { User } from "../types/User";
import { useTheme } from "../context/ThemeContext"; // ✅ Added to track theme state

interface FindMoreFriendsProps {
  users: User[];
  search: string;
}

export default function FindMoreFriends({
  users,
  search,
}: FindMoreFriendsProps) {
  const { theme } = useTheme(); // ✅ Destructure theme
  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6 px-2">
        {/* ✅ Using the same logic: Dark Gray for Light Mode, White for Dark Mode */}
        <h2
          className={`text-xl font-black tracking-tight ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}
        >
          Find More Friends
        </h2>
        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-wider">
          Suggestions
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((user) => (
            <FriendCard
              key={user.id}
              user={user}
              actionLabel="Add Friend"
              onAction={() => console.log("Request sent to", user.fullName)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-gray-100/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            No users found matching "{search}"
          </p>
        </div>
      )}
    </div>
  );
}
