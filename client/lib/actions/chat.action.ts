"use server";

import { ChatType } from "@/types/user";
import Chat from "../models/chat.model";
import { connect } from "@/lib/mongo.db";

export async function uploadChatMessage({
  senderId,
  senderName,
  message,
}: ChatType) {
  try {
    await connect();

    const newChat = new Chat({
      senderId,
      senderName,
      message,
    });

    await newChat.save();

    return { success: true };
  } catch (error) {
    console.error("Error uploading chat message:", error);
    return { success: false, error: "Failed to upload chat message" };
  }
}

export async function getAllChatMessages() {
  try {
    await connect();

    const allChats = await Chat.find().sort({ createdAt: -1 });

    return { success: true, data: allChats };
  } catch (error) {
    console.error("Error fetching chat message:", error);
    return { success: false, error: "Failed to fetch chat messages" };
  }
}
