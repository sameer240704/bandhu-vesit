// app/api/coloring/route.js
import { NextResponse } from "next/server";
import { ColoringGame } from "@/lib/models/colorGame.model";
import { connect } from "@/lib/mongo.db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";

export async function POST(req) {
  try {
    await connect();

    const requestBody = await req.json();
    const { userId, completed_levels, image, colors_used } = requestBody;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await User.findOne({ clerkId: userId }).select("_id");

    const coloringGame = new ColoringGame({
      userId: id,
      completed_levels,
      image, // Directly saving the image ID
      colors_used, // Directly saving the colors used
    });

    await coloringGame.save();

    return NextResponse.json(
      {
        message: "Coloring game data saved successfully",
        data: coloringGame,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving coloring game data:", error);
    return NextResponse.json(
      { message: "Error saving coloring game data", error: error.message },
      { status: 500 }
    );
  }
}
