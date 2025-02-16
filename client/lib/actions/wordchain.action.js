"use server";

import { connect } from "@/lib/mongo.db";
import { WordChain } from "../models/wordChain.model";
import { updateUserCoins } from "./points.action";

export async function insertGameDetails({
    userId,
    theme,
    score,
    streak,
    wordsUsed,
    difficulty,
    timeLimit,
    totalTimePlayed,
}) {
    try {
        await connect();

        if (!userId) {
            console.warn("No userId provided. Game data will not be saved.");
            return {
                success: false,
                message: "No userId provided. Game data will not be saved.",
            };
        }

        let wordChainData = await WordChain.findOne({ userId: userId });

        if (!wordChainData) {
            wordChainData = new WordChain({ userId: userId });
        }

        const previousAchievements = { ...wordChainData.achievements };

        wordChainData.stats.totalGamesPlayed += 1;
        wordChainData.stats.totalScore += score;
        wordChainData.stats.bestStreak = Math.max(
            wordChainData.stats.bestStreak,
            streak
        );

        const themeStats = wordChainData.themeStats[theme];
        themeStats.gamesPlayed += 1;
        themeStats.highestScore = Math.max(themeStats.highestScore, score);
        themeStats.wordsUsed = [...new Set([...themeStats.wordsUsed, ...wordsUsed])];
        themeStats.bestStreak = Math.max(themeStats.bestStreak, streak);

        wordChainData.gameHistory.push({
            theme,
            score,
            streak,
            wordsUsed,
            difficulty,
            timeLimit,
            totalTimePlayed,
        });

        await updateUserCoins({
            gameName: "wordChain",
            points: score,
            difficulty: difficulty,
            userId: userId
        });


        wordChainData.lastPlayed = new Date();

        if (wordChainData.stats.totalGamesPlayed >= 1) {
            wordChainData.achievements.playedOneTime = true;
        }
        if (score >= 100 && streak > 5) {
            wordChainData.achievements.perfectGame = true;
        }
        if (streak >= 10) {
            wordChainData.achievements.tenStreak = true;
        }
        if (wordChainData.stats.totalGamesPlayed >= 100) {
            wordChainData.achievements.hundredGames = true;
        }
        if (
            wordChainData.themeStats.animals.gamesPlayed > 0 &&
            wordChainData.themeStats.countries.gamesPlayed > 0 &&
            wordChainData.themeStats.fruits.gamesPlayed > 0
        ) {
            wordChainData.achievements.allThemesPlayed = true;
        }
        if (difficulty === "hard") {
            wordChainData.achievements.expertLevel = true;
        }

        await wordChainData.save();

        const newAchievements = {};
        for (const key in wordChainData.achievements) {
            if (
                wordChainData.achievements[key] === true &&
                previousAchievements[key] !== true
            ) {
                newAchievements[key] = true;
            }
        }

        return {
            success: true,
            message: "Game data saved successfully.",
            achievements: newAchievements,
        };
    } catch (error) {
        console.error("Error saving game data:", error);
        return {
            success: false,
            message: "Failed to save game data.",
        };
    }
}
