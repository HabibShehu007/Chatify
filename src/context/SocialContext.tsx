import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<SocialUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Wrapped in useCallback so it doesn't trigger infinite loops in useEffect
  const fetchSocialData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch Friendships - No messages, no extras.
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

      // 2. Fetch All Potential Users
      const { data: allUsers, error: userError } = await supabase
        .from("user_profile")
        .select("id, full_name")
        .neq("id", user.id); // Database filter using the table ID

      if (userError) throw userError;

      // 3. Robust Exclusion Logic
      const excludedIds = new Set<string>();
      excludedIds.add(String(user.id)); // Force string comparison

      relations?.forEach((r) => {
        excludedIds.add(String(r.sender_id));
        excludedIds.add(String(r.receiver_id));
      });

      const activeFriends =
        relations?.filter((r) => r.status === "accepted") || [];
      const incomingRequests =
        relations?.filter(
          (r) =>
            r.status === "pending" && String(r.receiver_id) === String(user.id),
        ) || [];

      const filteredSuggestions =
        allUsers?.filter((u) => !excludedIds.has(String(u.id))) || [];

      setFriends(activeFriends);
      setRequests(incomingRequests);
      setSuggestions(filteredSuggestions as SocialUser[]);
    } catch (err) {
      console.error("SOCIAL_FETCH_RECHECK:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSocialData();

    // Use a unique channel name to prevent interference with other contexts
    const channel = supabase
      .channel(`social_realtime_${user?.id}`)
      .on(
        "postgres_changes" as any,
        { event: "*", table: "friendships", schema: "public" },
        () => {
          console.log("Realtime update triggered...");
          fetchSocialData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchSocialData]);

  const sendRequest = async (targetId: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from("friendships").insert({
        sender_id: user.id,
        receiver_id: targetId,
        status: "pending",
      });
      if (error) throw error;
    } catch (err) {
      console.error("SEND_REQUEST_ERROR:", err);
    }
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
