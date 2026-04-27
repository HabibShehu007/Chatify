// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";
import {
  FaCamera,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaQuoteLeft,
  FaCheck,
} from "react-icons/fa";

export default function Profile() {
  const { user, refreshUser } = useUser(); // Only pull what exists in your Context
  const [updating, setUpdating] = useState(false);

  // Initialize local state with data from your UserProfile type
  const [formData, setFormData] = useState({
    bio: "",
    profession: "",
    state: "",
    country: "",
    phone: "", // Matches your 'phone' property in UserProfile
  });

  // Sync local state when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        bio: (user as any).bio || "",
        profession: (user as any).profession || "",
        state: (user as any).state || "",
        country: (user as any).country || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          bio: formData.bio,
          profession: formData.profession,
          state: formData.state,
          country: formData.country,
          phone: formData.phone,
        })
        .eq("id", user.id);

      if (error) throw error;

      // ✅ Use your existing refresh function to update the global state
      await refreshUser();
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Identity Card */}
        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-900 w-full rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-40 h-40 rounded-full border-4 border-blue-600/20 overflow-hidden bg-blue-600 flex items-center justify-center text-white text-6xl font-black">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                <FaCamera size={16} />
              </button>
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-blue-600 font-bold text-sm mb-6">
              {formData.profession || "Set your profession"}
            </p>

            <div className="w-full pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest leading-loose">
                Setting up your details makes it easier for people to find and
                connect with you! 🚀
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Information Editor */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full" />
              Detailed Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <FaQuoteLeft className="text-blue-600" /> About You (Bio)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-sm outline-none dark:text-white"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <FaBriefcase className="text-blue-600" /> Profession
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData({ ...formData, profession: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm outline-none dark:text-white"
                  placeholder="e.g. Software Developer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <FaPhone className="text-blue-600" /> Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm outline-none dark:text-white"
                  placeholder="+234..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" /> State / City
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm outline-none dark:text-white"
                  placeholder="e.g. Katsina"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <FaGlobe className="text-blue-600" /> Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm outline-none dark:text-white"
                  placeholder="e.g. Nigeria"
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                disabled={updating}
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2"
              >
                {updating ? (
                  "Updating..."
                ) : (
                  <>
                    <FaCheck /> Save Info
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
