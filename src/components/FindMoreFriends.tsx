// src/components/FindMoreFriends.tsx
import FriendCard from "./FriendCard"; // Ensure this path is correct!
import { useTheme } from "../context/ThemeContext";
import { useSocial } from "../context/SocialContext";
import type { User } from "../types/User"; // Import your User type

interface FindMoreFriendsProps {
  search: string;
}

export default function FindMoreFriends({ search }: FindMoreFriendsProps) {
  const { theme } = useTheme();
  const { suggestions, sendRequest, loading } = useSocial();

  const filtered = suggestions.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm text-gray-500">Searching for people...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6 px-2">
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
          {filtered.map((u) => {
            // Create a temporary User object to pass to the card
            const userData: User = {
              id: u.id,
              fullName: u.full_name,
            };

            return (
              <FriendCard
                key={u.id}
                user={userData}
                actionLabel="Add Friend"
                onAction={() => sendRequest(u.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-gray-100/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {search
              ? `No users found matching "${search}"`
              : "No new suggestions available."}
          </p>
        </div>
      )}
    </div>
  );
}
