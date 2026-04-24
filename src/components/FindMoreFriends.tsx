// src/components/FindMoreFriends.tsx
import FriendCard from "./FriendCard";
import type { User } from "../types/User";

interface FindMoreFriendsProps {
  users: User[];
  search: string;
}

export default function FindMoreFriends({
  users,
  search,
}: FindMoreFriendsProps) {
  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Find More Friends</h2>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((user) => (
          <FriendCard
            key={user.id}
            user={user}
            actionLabel="Send Request"
            onAction={() => console.log("Request sent to", user.fullName)}
          />
        ))}
      </div>
    </div>
  );
}
