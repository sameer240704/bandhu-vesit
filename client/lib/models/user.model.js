import { model, Schema, models, Document } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true },
  coins: { type: Number, required: true, default: 100 },
  profileImageUrl: { type: String },
});

const User = models.User || model("User", UserSchema);

export default User;
