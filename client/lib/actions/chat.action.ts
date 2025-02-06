"use server";

import { connect } from "@/lib/mongo.db";
import Chat from "../models/chat.model";
import { Types } from "mongoose";

export interface ChatMessage {
  _id?: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt?: string | Date;
}

interface ChatResponse {
  success: boolean;
  data?: ChatMessage[];
  error?: string;
}

export async function uploadChatMessage({
  senderId,
  senderName,
  message,
}: ChatMessage): Promise<{
  success: boolean;
  data?: ChatMessage;
  error?: string;
}> {
  try {
    await connect();

    const newChat = new Chat({
      senderId: new Types.ObjectId(senderId),
      senderName,
      message,
    });

    const savedChat = await newChat.save();

    return {
      success: true,
      data: {
        _id: savedChat._id.toString(),
        senderId: savedChat.senderId.toString(),
        senderName: savedChat.senderName,
        message: savedChat.message,
        createdAt: savedChat.createdAt,
      },
    };
  } catch (error) {
    console.error("Error uploading chat message:", error);
    return {
      success: false,
      error: "Failed to upload chat message",
    };
  }
}

export async function getAllChatMessages(): Promise<ChatResponse> {
  try {
    await connect();

    const allChats = await Chat.find().sort({ createdAt: 1 });

    return {
      success: true,
      data: allChats.map((chat) => ({
        _id: chat._id.toString(),
        senderId: chat.senderId.toString(),
        senderName: chat.senderName,
        message: chat.message,
        createdAt: chat.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching chat message:", error);
    return {
      success: false,
      error: "Failed to fetch chat messages",
    };
  }
}
