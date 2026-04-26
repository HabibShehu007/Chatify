// src/context/SocialContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./UserContext";

// 1. Define what a Social User looks like to fix the "never" errors
interface SocialUser {
  id: string;
  full_name: string;
  avatar: string | null;
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

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // 2. Add types to useState to stop the "argument not assignable to never" errors
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<SocialUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSocialData = async () => {
    // 3. Fix: "user is possibly null" - Stop execution if no user is found
    if (!user?.id) return;

    setLoading(true);

    const { data: relations } = await supabase
      .from("friendships")
      .select(
        `*, sender:sender_id(id, full_name, avatar), receiver:receiver_id(id, full_name, avatar)`,
      )
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    const { data: allUsers } = await supabase
      .from("user_profile")
      .select("id, full_name, avatar")
      .neq("id", user.id);

    const activeFriends =
      relations?.filter((r) => r.status === "accepted") || [];
    const incomingRequests =
      relations?.filter(
        (r) => r.status === "pending" && r.receiver_id === user.id,
      ) || [];

    const relatedIds =
      relations?.map((r) =>
        r.sender_id === user.id ? r.receiver_id : r.sender_id,
      ) || [];
    const filteredSuggestions =
      allUsers?.filter((u) => !relatedIds.includes(u.id)) || [];

    setFriends(activeFriends);
    setRequests(incomingRequests);
    setSuggestions(filteredSuggestions as SocialUser[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSocialData();

    // 4. Fix: Corrected Real-time syntax for Supabase v2
    const channel = supabase
      .channel("social_changes")
      .on(
        "postgres_changes" as any, // Cast to any to bypass strict overload if necessary
        { event: "*", table: "friendships", schema: "public" },
        () => fetchSocialData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Use user.id as dependency for stability

  const sendRequest = async (targetId: string) => {
    if (!user?.id) return; // Guard clause
    await supabase.from("friendships").insert({
      sender_id: user.id,
      receiver_id: targetId,
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

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) throw new Error("useSocial must be used within SocialProvider");
  return context;
};
