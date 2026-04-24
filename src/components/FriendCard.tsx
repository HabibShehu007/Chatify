// src/components/FriendCard.tsx
import type { User } from "../types/User";

interface FriendCardProps {
  user: User;
  actionLabel: string;
  onAction: () => void;
}

const getAvatar = (user: User) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName}
        className="w-16 h-16 rounded-full"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
      {user.fullName.charAt(0)}
    </div>
  );
};

export default function FriendCard({
  user,
  actionLabel,
  onAction,
}: FriendCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-lg shadow aspect-square 
                    bg-gray-100 dark:bg-gray-800 transition"
    >
      {getAvatar(user)}
      <span className="mt-2 font-medium text-gray-800 dark:text-white">
        {user.fullName}
      </span>
      <button
        onClick={onAction}
        className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
      >
        {actionLabel}
      </button>
    </div>
  );
}
