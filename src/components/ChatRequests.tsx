// src/components/ChatRequests.tsx
import FriendCard from "./FriendCard";
import type { User } from "../types/User";

interface ChatRequestsProps {
  users: User[];
  search: string;
}

export default function ChatRequests({ users, search }: ChatRequestsProps) {
  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chat Requests</h2>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((user) => (
          <FriendCard
            key={user.id}
            user={user}
            actionLabel="Accept"
            onAction={() => console.log("Accepted", user.fullName)}
          />
        ))}
      </div>
    </div>
  );
}
