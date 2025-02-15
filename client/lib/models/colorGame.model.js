import { Schema, model } from "mongoose";

const ColoringGameSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  categories: [
    {
      name: { type: String, required: true, unique: true },
      description: { type: String },
      levels: [
        {
          name: { type: number, required: true },
          description: { type: String },
        },
      ],
    },
  ],
  images: [
    {
      level: {
        type: number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      image_url: { type: String, required: true },
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
});

export default model("ColoringGame", ColoringGameSchema);
