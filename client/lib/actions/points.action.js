"use server";

import { connect } from "../mongo.db";
import User from "../models/user.model";

export async function updateUserCoins({ gameName, points, difficulty, userId }) {
    try {
        await connect();

        if (!userId) {
            console.warn("No userId provided. Coins will not be updated.");
            return {
                success: false,
                message: "No userId provided. Coins will not be updated.",
            };
        }

        const user = await User.findById(userId);

        if (!user) {
            console.warn("User not found. Coins will not be updated.");
            return {
                success: false,
                message: "User not found. Coins will not be updated.",
            };
        }

        let basePoints = 0;
        switch (gameName) {
            case "wordChain":
                basePoints = points * 1;
                break;
            case "puzzleMaster":
                basePoints = points * 2;
                break;
            case "speedTyping":
                basePoints = points * 1.5;
                break;
            default:
                basePoints = points * 1;
                break;
        }

        let difficultyMultiplier = 1;
        switch (difficulty) {
            case "easy":
                difficultyMultiplier = 1;
                break;
            case "medium":
                difficultyMultiplier = 1.25;
                break;
            case "hard":
                difficultyMultiplier = 1.5;
                break;
            default:
                difficultyMultiplier = 1;
                break;
        }

        let coinsEarned = basePoints * difficultyMultiplier;

        if (points > 1000) {
            coinsEarned += 50;
        }

        user.coins += Math.round(coinsEarned);
        await user.save();

        return {
            success: true,
            message: "Coins updated successfully.",
            coinsEarned: Math.round(coinsEarned),
            totalCoins: user.coins,
        };
    } catch (error) {
        console.error("Error updating coins:", error);
        return {
            success: false,
            message: "Failed to update coins.",
        };
    }
}
