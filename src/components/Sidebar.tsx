// src/components/Sidebar.tsx
import { FaUserCircle, FaCog, FaUsers, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="hidden md:flex w-20 flex-col justify-between">
      <div className="flex flex-col items-center space-y-6 mt-6">
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaComments className="text-2xl mb-1" />
          Chat
        </Link>
        <Link
          to="/friends"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaUsers className="text-2xl mb-1" />
          Friends
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center text-sm hover:text-blue-600 transition"
        >
          <FaCog className="text-2xl mb-1" />
          Settings
        </Link>
      </div>
      <Link
        to="/profile"
        className="p-4 cursor-pointer hover:opacity-80 flex justify-center"
      >
        <FaUserCircle className="text-4xl" />
      </Link>
    </div>
  );
}
