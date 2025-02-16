import { Schema, model, models } from "mongoose";

const ColoringGameSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  completed_levels: { type: Number, required: true }, // Track completed levels

  image: {
    type: String,
    required: true,
  },
  colors_used: [
    {
      name: { type: String, required: true },
      hex_code: { type: String, required: true },
    },
  ],
});

const ColoringGame =
  models.ColoringGame || model("ColoringGame", ColoringGameSchema);
export { ColoringGame };
