import { Schema, model, models } from "mongoose";

const ColoringGameSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  completed_levels: [{ type: Schema.Types.ObjectId, ref: "ColoringGame" }], // Track completed levels
  colored_images: [
    {
      image: {
        type: Schema.Types.ObjectId,
        ref: "ColoringGame",
        required: true,
      },
      colors_used: [
        {
          name: { type: String, required: true },
          hex_code: { type: String, required: true },
        },
      ],
    },
  ],
  high_scores: { type: Map, of: Number },
});

const ColoringGame =
  models.ColoringGame || model("ColoringGame", ColoringGameSchema);
export { ColoringGame };
