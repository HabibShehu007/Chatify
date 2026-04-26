// src/context/ChatContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // ✅ Use your verified client path
import { useUser } from "./UserContext";

const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Inside src/context/ChatContext.tsx

  const fetchChats = async () => {
    if (!user?.id) return;

    // 1. Fetch friendships AND the latest message for each
    const { data, error } = await supabase
      .from("friendships")
      .select(
        `
      id,
      sender:sender_id(id, full_name, avatar), 
      receiver:receiver_id(id, full_name, avatar),
      messages (
        content,
        created_at
      )
    `,
      )
      .eq("status", "accepted")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      // This ordering ensures we get the newest message if we limit it
      .order("created_at", { foreignTable: "messages", ascending: false })
      .limit(1, { foreignTable: "messages" });

    if (!error && data) {
      const formattedChats = data.map((f: any) => {
        const friend = f.sender.id === user.id ? f.receiver : f.sender;

        // 2. Get the actual last message content
        const lastMsg =
          f.messages && f.messages.length > 0
            ? f.messages[0].content
            : "No messages yet";

        return {
          id: f.id,
          friendId: friend.id,
          name: friend.full_name,
          avatar: friend.avatar,
          lastMessage: lastMsg, // ✅ Now dynamic!
        };
      });
      setChats(formattedChats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();

    const channel = supabase
      .channel("friendship_updates")
      .on(
        "postgres_changes" as any,
        { event: "*", table: "friendships", schema: "public" },
        () => fetchChats(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <ChatContext.Provider value={{ chats, loading, refreshChats: fetchChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
