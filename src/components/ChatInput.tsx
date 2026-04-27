import { useState, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { Paperclip, Send, Mic, X } from "lucide-react";

export default function ChatInput() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, activeChat } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle Text Sending
  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  };

  // 2. Handle File Selection (UI only for now)
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // We will add the upload logic here in the next step
    }
  };

  // 3. Handle Voice Recording (UI only for now)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // We will add the MediaRecorder logic here later
  };

  if (!activeChat) return null; // Don't show input if no chat is selected

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl relative">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf"
        />

        {/* Attachment Button */}
        <button
          onClick={handleFileClick}
          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
        >
          <Paperclip size={20} />
        </button>

        {/* Dynamic Input Area */}
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between px-4 text-red-500 animate-pulse">
            <span className="text-sm font-bold">Recording Voice Note...</span>
            <button onClick={toggleRecording} className="text-gray-400">
              <X size={18} />
            </button>
          </div>
        ) : (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-700 dark:text-gray-200"
          />
        )}

        {/* Action Button: Send or Mic */}
        {text.trim() ? (
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <Send size={18} />
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-xl transition ${
              isRecording
                ? "bg-red-500 text-white"
                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
