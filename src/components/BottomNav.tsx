// src/components/BottomNav.tsx
import { FaUserCircle, FaCog, FaUsers, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
interface BottomNavProps {
  show: boolean;
}

export default function BottomNav({ show }: BottomNavProps) {
  if (!show) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-blue-950 border-t border-gray-200 dark:border-blue-800 flex justify-around py-2">
      <Link
        to="/dashboard"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaComments className="text-2xl mb-1" />
        Chat
      </Link>
      <Link
        to="/friends"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaUsers className="text-2xl mb-1" />
        Friends
      </Link>
      <Link
        to="/profile"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaUserCircle className="text-2xl mb-1" />
        Profile
      </Link>
      <Link
        to="/settings"
        className="flex flex-col items-center text-sm text-gray-700 dark:text-white hover:text-blue-600 transition"
      >
        <FaCog className="text-2xl mb-1" />
        Settings
      </Link>
    </div>
  );
}
