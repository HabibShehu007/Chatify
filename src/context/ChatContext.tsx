// src/context/ChatContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./UserContext";

const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // 1. FETCH CHATS: Now with sorting so newest messages jump to the top
  const fetchChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
          id,
          sender:sender_id(id, full_name), 
          receiver:receiver_id(id, full_name),
          messages (
            content,
            created_at,
            sender_id,
            is_read
          )
        `,
        )
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { foreignTable: "messages", ascending: false });

      if (error) throw error;
      if (data) {
        const formattedChats = data.map((f: any) => {
          const friend =
            String(f.sender.id) === String(user.id) ? f.receiver : f.sender;
          const lastMsgObj =
            f.messages && f.messages.length > 0 ? f.messages[0] : null;

          const unreadCount =
            f.messages?.filter(
              (m: any) => m.sender_id !== user.id && m.is_read === false,
            ).length || 0;

          return {
            id: f.id,
            friendId: friend.id,
            name: friend.full_name,
            lastMessage: lastMsgObj?.content || "No messages yet",
            lastMessageTime: lastMsgObj?.created_at || null,
            unreadCount: unreadCount,
          };
        });

        // SORTING LOGIC: Move chat with newest message to the top
        const sortedChats = formattedChats.sort((a, b) => {
          const timeA = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0;
          const timeB = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0;
          return timeB - timeA;
        });

        setChats(sortedChats);
      }
    } catch (err) {
      console.error("CHAT_FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 2. FETCH MESSAGES for active chat
  const fetchMessages = useCallback(async (friendshipId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("friendship_id", friendshipId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  }, []);

  // 3. MARK AS READ: Clear bubbles when viewing chat
  const markAsRead = useCallback(
    async (friendshipId: string) => {
      if (!user?.id) return;
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("friendship_id", friendshipId)
        .neq("sender_id", user.id)
        .eq("is_read", false);

      if (!error) fetchChats();
    },
    [user?.id, fetchChats],
  );

  // 4. SEND MESSAGE
  const sendMessage = async (content: string) => {
    if (!user?.id || !activeChat?.id) return;
    const { error } = await supabase.from("messages").insert({
      friendship_id: activeChat.id,
      sender_id: user.id,
      content: content,
    });
    if (error) console.error("SEND_MSG_ERROR:", error);
    fetchChats();
  };

  // EFFECT: Friendship changes
  useEffect(() => {
    fetchChats();
    const channel = supabase
      .channel(`sidebar_friends_${user?.id}`)
      .on(
        "postgres_changes" as any,
        { event: "*", table: "friendships", schema: "public" },
        () => fetchChats(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchChats]);

  // EFFECT: Real-time Messages & Auto-Read
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("global_realtime_messages")
      .on(
        "postgres_changes" as any,
        { event: "INSERT", table: "messages", schema: "public" },
        (payload) => {
          if (activeChat && payload.new.friendship_id === activeChat.id) {
            setMessages((prev) => [...prev, payload.new]);
            markAsRead(activeChat.id); // Mark new incoming message as read if chat is open
          }
          fetchChats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, activeChat?.id, fetchChats, markAsRead]);

  // EFFECT: Mark as read when switching chats
  useEffect(() => {
    if (activeChat?.id) {
      fetchMessages(activeChat.id);
      markAsRead(activeChat.id);
    }
  }, [activeChat?.id, fetchMessages, markAsRead]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        activeChat,
        setActiveChat,
        messages,
        sendMessage,
        markAsRead,
        refreshChats: fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
