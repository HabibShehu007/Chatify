import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./UserContext";

interface SocialUser {
  id: string;
  full_name: string;
}

interface SocialContextType {
  friends: any[];
  requests: any[];
  suggestions: SocialUser[];
  loading: boolean;
  sendRequest: (targetId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

// FIX: We define the Provider as a standard export to satisfy Vite's Fast Refresh
export function SocialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<SocialUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSocialData = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // 1. Fetch Friendships - COMPLETELY STRIPPED BACK TO BASICS
      const { data: relations, error: relError } = await supabase
        .from("friendships")
        .select(
          `
          id, 
          status, 
          sender_id, 
          receiver_id,
          sender:user_profile!friendships_sender_id_fkey(id, full_name),
          receiver:user_profile!friendships_receiver_id_fkey(id, full_name)
        `,
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (relError) throw relError;

      // 2. Fetch All Other Users
      const { data: allUsers, error: userError } = await supabase
        .from("user_profile")
        .select("id, full_name")
        .neq("id", user.id);

      if (userError) throw userError;

      // 3. Exclusion Logic
      const excludedIds = new Set<string>();
      excludedIds.add(user.id);

      relations?.forEach((r) => {
        excludedIds.add(r.sender_id);
        excludedIds.add(r.receiver_id);
      });

      const activeFriends =
        relations?.filter((r) => r.status === "accepted") || [];
      const incomingRequests =
        relations?.filter(
          (r) => r.status === "pending" && r.receiver_id === user.id,
        ) || [];

      const filteredSuggestions =
        allUsers?.filter((u) => !excludedIds.has(u.id)) || [];

      setFriends(activeFriends);
      setRequests(incomingRequests);
      setSuggestions(filteredSuggestions as SocialUser[]);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
    const channel = supabase
      .channel("social_updates")
      .on(
        "postgres_changes" as any,
        { event: "*", table: "friendships", schema: "public" },
        () => fetchSocialData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const sendRequest = async (targetId: string) => {
    if (!user?.id) return;
    await supabase.from("friendships").insert({
      sender_id: user.id,
      receiver_id: targetId,
      status: "pending",
    });
  };

  const acceptRequest = async (requestId: string) => {
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", requestId);
  };

  const rejectRequest = async (requestId: string) => {
    await supabase.from("friendships").delete().eq("id", requestId);
  };

  return (
    <SocialContext.Provider
      value={{
        friends,
        requests,
        suggestions,
        loading,
        sendRequest,
        acceptRequest,
        rejectRequest,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

// FIX: Exporting the hook separately like this is the "Consistent Export" Vite wants
export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) throw new Error("useSocial must be used within SocialProvider");
  return context;
};
