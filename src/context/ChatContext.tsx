// src/context/ChatContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./UserContext";

const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only "Accepted" friendships to show in the Dashboard
  const fetchChats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("friendships")
      .select(
        `
        id,
        sender:sender_id(id, fullName, avatar),
        receiver:receiver_id(id, fullName, avatar)
      `,
      )
      .eq("status", "accepted")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!error) {
      // Format the data so the "Friend" is always the other person
      const formattedChats = data.map((f: any) => {
        const friend = f.sender.id === user.id ? f.receiver : f.sender;
        return {
          id: f.id, // Friendship ID acts as Chat ID
          friendId: friend.id,
          name: friend.fullName,
          avatar: friend.avatar,
          lastMessage: "No messages yet", // You'd fetch this from messages table later
        };
      });
      setChats(formattedChats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();

    // Real-time listener: Refresh list when a friendship is updated/added
    const channel = supabase
      .channel("friendship_updates")
      .on("postgres_changes", { event: "*", table: "friendships" }, () =>
        fetchChats(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <ChatContext.Provider value={{ chats, loading, refreshChats: fetchChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
