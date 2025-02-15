import { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true },
  coins: { type: Number, required: true, default: 100 },
  profileImageUrl: { type: String },
  age: { type: Number },
  phoneNumber: { type: String, default: "4242424242" },
  location: { type: String, default: "Mumbai, Maharashtra" },
  mentalAbilityLevel: {
    type: String,
    required: true,
    enum: ["Mild", "Moderate", "Severe", "Profound"],
    default: "Moderate"
  },
  rewards: {
    badges: [{ type: String }],
    points: { type: Number, default: 0 }
  },
  dateOfBirth: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

const User = models.User || model("User", UserSchema);

export default User;
