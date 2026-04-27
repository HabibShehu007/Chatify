// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { UserProfile } from "../types/User";

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();

      if (authData?.user) {
        const { data: profile, error } = await supabase
          .from("user_profile")
          .select("*")
          .eq("user_id", authData.user.id)
          .single();

        if (profile) {
          // REVAMPED: We use the Table 'id' as the main ID for social filtering
          setUser({
            id: profile.id, // This matches the "id" column in your database
            authId: profile.user_id, // Keep this if you need the Auth UUID later
            fullName: profile.full_name,
            username: profile.username,
            phone: profile.phone,
            avatar: profile.avatar,
            createdAt: profile.created_at,
            email: authData.user.email,
          } as any); // Temporary 'any' until you update the UserProfile type
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
