import { model, Schema, models, Document } from "mongoose";

export interface MindPlayUser extends Document {
  clerkId: string;
  fullName: string;
  email: string;
  userName: string;
  coins: number;
  imageUrl: string;
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true },
  coins: { type: Number, required: true, default: 100 },
  profileImageUrl: { type: String, required: true },
});

const User = models.User || model<MindPlayUser>("User", UserSchema);

export default User;
