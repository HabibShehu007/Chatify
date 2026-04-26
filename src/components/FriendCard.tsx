// src/components/FriendCard.tsx
import type { User } from "../types/User";

interface FriendCardProps {
  user: User;
  actionLabel: string;
  onAction: () => void;
}

export default function FriendCard({
  user,
  actionLabel,
  onAction,
}: FriendCardProps) {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div
      className="group flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300
                    bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                    shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Avatar Container */}
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 p-0.5"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 
                          flex items-center justify-center text-white font-bold text-2xl shadow-inner"
          >
            {getInitials(user.fullName)}
          </div>
        )}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
          {user.fullName}
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
          Member
        </p>
      </div>

      <button
        onClick={onAction}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold 
                   py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 
                   active:scale-95 flex items-center justify-center gap-2"
      >
        {actionLabel}
      </button>
    </div>
  );
}
