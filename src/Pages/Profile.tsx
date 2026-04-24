// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ThemeToggler from "../components/ThemeToggler";
import type { UserProfile } from "../types/User";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaCamera } from "react-icons/fa";
import { supabase } from "../lib/supabase"; // ✅ your Supabase client

export default function Profile() {
  const { theme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profile")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        } else if (profile) {
          // ✅ Map Supabase fields into camelCase
          setUser({
            id: profile.user_id,
            fullName: profile.full_name, // map correctly
            username: profile.username,
            phone: profile.phone,
            avatar: profile.avatar,
            createdAt: profile.created_at,
            email: data.user.email, // from auth table
          } as UserProfile);
        }
      }
    };

    fetchUser();
  }, []);

  const getAvatar = () => {
    if (user?.avatar) {
      return (
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <FaCamera className="absolute bottom-0 right-0 text-blue-600 bg-white rounded-full p-1 cursor-pointer" />
        </div>
      );
    }
    return (
      <div className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
        {user?.fullName?.charAt(0)}
        <FaCamera className="absolute bottom-0 right-0 text-blue-600 bg-white rounded-full p-1 cursor-pointer" />
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        theme === "light"
          ? "bg-gray-50 text-gray-800"
          : "bg-gray-900 text-white"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Profile
          </h1>
          <ThemeToggler />
        </div>

        {/* Profile Card */}
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center space-x-4 mb-6">
            {getAvatar()}
            <div>
              <h2 className="text-xl font-semibold">{user?.fullName}</h2>
              <p className="text-sm opacity-80">User ID: {user?.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-400" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-blue-400" />
              <span>
                Joined: {new Date(user?.createdAt || "").toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav show={true} />
    </div>
  );
}
