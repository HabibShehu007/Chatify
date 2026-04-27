import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import { useEffect, useRef } from "react";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

export default function MessageList() {
  const { messages } = useChat();
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg: any) => {
        const isMe = msg.sender_id === user?.id;

        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium shadow-sm relative ${
                isMe
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 rounded-tl-none"
              }`}
            >
              {/* Message Content */}
              <div className="break-words">{msg.content}</div>

              {/* Meta Info: Time + Ticks */}
              <div
                className={`text-[9px] mt-1 flex items-center gap-1 opacity-70 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Only show ticks for messages I sent */}
                {isMe && (
                  <span className="text-xs">
                    {msg.is_read ? (
                      <IoCheckmarkDone className="text-blue-200" title="Read" />
                    ) : (
                      <IoCheckmark className="text-white/80" title="Sent" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* The Scroll Anchor - MUST be inside the parent div */}
      <div ref={scrollRef} className="h-2" />
    </div>
  );
}
