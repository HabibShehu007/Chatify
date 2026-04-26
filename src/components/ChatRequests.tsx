// src/components/ChatRequests.tsx
import FriendCard from "./FriendCard";
import type { User } from "../types/User";
import { useTheme } from "../context/ThemeContext";
import { useSocial } from "../context/SocialContext"; // ✅ Added to get live data

interface ChatRequestsProps {
  search: string; // ✅ 'users' prop removed because we use Context now
}

export default function ChatRequests({ search }: ChatRequestsProps) {
  const { theme } = useTheme();
  // ✅ 1. Pull the real requests and accept function from our context
  const { requests, acceptRequest, loading } = useSocial();

  // ✅ 2. Filter requests based on the sender's full_name
  const filtered = requests.filter((req) =>
    req.sender.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading && requests.length === 0) {
    return (
      <p className="text-center py-4 text-xs text-gray-500">
        Checking for requests...
      </p>
    );
  }

  return (
    <div className="py-6 border-b border-gray-200 dark:border-gray-800 mb-8">
      <div className="flex items-center justify-between mb-6 px-2">
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

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((req) => {
            // ✅ 3. Mapping the Supabase 'sender' object to your 'User' type
            const senderAsUser: User = {
              id: req.sender.id,
              fullName: req.sender.full_name,
              avatar: req.sender.avatar,
            };

            return (
              <FriendCard
                key={req.id} // Friendship ID from database
                user={senderAsUser}
                actionLabel="Accept Chat"
                // ✅ 4. Use the context function to update Supabase
                onAction={() => acceptRequest(req.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 italic">No pending requests.</p>
        </div>
      )}
    </div>
  );
}
