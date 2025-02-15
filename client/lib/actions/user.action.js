"use server";

import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongo.db";

export async function createUser(user) {
  try {
    await connect();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(userId, updateData) {
  try {
    await connect();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getUserDetails(userId) {
  try {
    await connect();

    const newUser = await User.findOne({ _id: userId });

    if (!newUser) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export default async function updateFavoriteGames(userId, gameName, newValue) {
  try {
    await connect();

    const user = await User.findOne({ clerkId: userId }); // Find user by clerkId

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the game already exists in the array
    const gameIndex = user.faovriteGames.findIndex(
      (game) => game.name === gameName
    );

    if (gameIndex !== -1) {
      // If the game exists, update its value
      const update = {};
      update[`faovriteGames.${gameIndex}.value`] = newValue;

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: userId },
        { $set: update },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return JSON.parse(JSON.stringify(updatedUser));
    } else {
      // If the game doesn't exist, add it to the array
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: userId },
        { $push: { faovriteGames: { name: gameName, value: newValue } } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return JSON.parse(JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error("Error updating favorite games:", error);
    throw error;
  }
}
