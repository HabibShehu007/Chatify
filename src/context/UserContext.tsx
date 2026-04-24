// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { UserProfile } from "../types/User";

// 1. Define what data our "Brain" will share with the app
interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>; // Use this to force-update data (e.g., after a profile edit)
}

// 2. Create the actual Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. The Provider component that wraps your app
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // The logic to fetch user data from Supabase
  const fetchUser = async () => {
    try {
      setLoading(true);

      // Get the session user from Supabase Auth
      const { data: authData } = await supabase.auth.getUser();

      if (authData?.user) {
        // Get the extra profile info from your 'user_profile' table
        const { data: profile, error } = await supabase
          .from("user_profile")
          .select("*")
          .eq("user_id", authData.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.user_id,
            fullName: profile.full_name,
            username: profile.username,
            phone: profile.phone,
            avatar: profile.avatar,
            createdAt: profile.created_at,
            email: authData.user.email,
          } as UserProfile);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("UserContext Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // 4. Listen for Auth changes (like logging out or logging in)
    // This makes sure the app reacts instantly if the user session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else {
        fetchUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 5. Custom hook to make using this data super easy
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
