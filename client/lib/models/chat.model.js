import { Schema, model, models, Document, Types } from "mongoose"

const ChatsSchema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", ChatsSchema);

export default Chat;
