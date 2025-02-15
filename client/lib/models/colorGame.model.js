import { Schema, model } from "mongoose";

const ColoringGameSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  categories: [
    {
      name: { type: String, required: true, unique: true },
      description: { type: String },
    },
  ],
  levels: [
    {
      category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true,
      },
      name: { type: String, required: true },
      description: { type: String },

      colors: [
        {
          name: { type: String, required: true },
          hex_code: { type: String, required: true },
        },
      ],
    },
  ],
  images: [
    {
      level: {
        type: Schema.Types.ObjectId,
        ref: "levels",
        required: true,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true,
      },
      image_url: { type: String, required: true },
      outline_url: { type: String, required: true },
    },
  ],
  colors: [
    {
      name: { type: String, required: true, unique: true },
      hex_code: { type: String, required: true },
    },
  ],
  user_colorings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      image: {
        type: Schema.Types.ObjectId,
        ref: "images",
        required: true,
      },
      color: {
        type: Schema.Types.ObjectId,
        ref: "colors",
        required: true,
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  game_progress: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      level: {
        type: Schema.Types.ObjectId,
        ref: "levels",
        required: true,
      },
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      time_taken: { type: Number, default: 0 }, // Time in seconds
    },
  ],
});

export default model("ColoringGame", ColoringGameSchema);
