"use client";

import React, { useState, useEffect, useRef } from "react";
import { socket } from "@/socket";
import {
  uploadChatMessage,
  getAllChatMessages,
} from "@/lib/actions/chat.action";

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchChats() {
      const response = await getAllChatMessages();
      if (response.success) {
        setMessages(response?.data);
      }
    }
    fetchChats();

    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatData = {
      userId: "67a3ba1ee7ba9e16cdbc72fb",
      userName: "sameer42",
      message: newMessage,
      imageUrl: "",
    };

    const response = await uploadChatMessage(chatData);
    if (response.success) {
      socket.emit("sendMessage", chatData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] border border-gray-300 rounded-lg">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.userId === "65abc123xyz" ? "bg-blue-300" : "bg-gray-200"
            }`}
          >
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
