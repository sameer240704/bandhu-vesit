// app/api/coloring-game/add-images/route.js
import { NextResponse } from "next/server";
import { ColoringGame } from "@/lib/models/colorGame.model";
import { connect } from "@/lib/mongo.db";

export async function POST(req) {
  console.log(req);
  try {
    await connect();

    const { level, category, image_url, name, description, colors } =
      await req.formData();

    if (!level || !category || !image_url || !name || !colors) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newGame = new ColoringGame({
      level,
      category,
      image_url,
      name,
      description,
      colors,
    });

    console.log("GG", newGame);

    await newGame.save();

    return NextResponse.json({ success: true, data: newGame }, { status: 201 });
  } catch (error) {
    console.error("Error adding image:", error);

    // Check for specific Mongoose errors (e.g., validation errors, duplicate key errors)
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        { success: false, message: "Validation error", errors: errors },
        { status: 400 }
      );
    } else if (error.code === 11000) {
      // Duplicate key error (e.g., category already exists)
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  // Corrected GET function for app directory
  try {
    await connect();
    console.log("DD");

    return NextResponse.json(
      { message: "Hello from the API!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to database:", error);
    console.log("GG");

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
