import { Schema, model, models, Document, Types } from "mongoose";

export interface ChatsInterface extends Document {
  senderId: Types.ObjectId;
  senderName: string;
  message: string;
  createdAt?: Date;
}

const ChatsSchema: Schema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat = models.Chat || model<ChatsInterface>("Chat", ChatsSchema);

export default Chat;
