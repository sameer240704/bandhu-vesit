"use client";
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Check,
  Timer,
  Trophy,
  Cat,
  Globe2,
  Apple,
  Crown,
  Star,
  Clock,
  Sparkles,
  XCircle,
  Brain,
  Zap,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoryValidation } from "@/constants/wordChainData";
import { insertGameDetails } from "@/lib/actions/wordchain.action";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const themeIcons = {
  animals: Cat,
  countries: Globe2,
  fruits: Apple,
};

const difficultyIcons = {
  easy: Shield,
  medium: Brain,
  hard: Zap,
};

const WordChainGame = () => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [baseTimeLimit, setBaseTimeLimit] = useState(15);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("medium");
  const [recentPerformances, setRecentPerformances] = useState([]);
  const [lastWordStartTime, setLastWordStartTime] = useState(Date.now());
  const [achievements, setAchievements] = useState(null);
  const gameStartTimeRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameStarted) {
      gameStartTimeRef.current = Date.now();
    }
  }, [gameStarted]);

  const validateCategory = (word, theme) => {
    return categoryValidation[theme].includes(word.toLowerCase());
  };

  const analyzeMovePerformance = (
    wordLength,
    timeUsed,
    isSuccess,
    isValidCategory
  ) => {
    return {
      wordLength,
      timeUsed,
      isSuccess,
      isValidCategory,
    };
  };

  const adjustDifficulty = (performances) => {
    if (performances.length < 3)
      return { difficulty: "medium", timeAdjustment: 0 };

    const recentPerfs = performances.slice(-3);
    const avgWordLength =
      recentPerfs.reduce((sum, p) => sum + p.wordLength, 0) / 3;
    const avgTimeUsed = recentPerfs.reduce((sum, p) => sum + p.timeUsed, 0) / 3;
    const successRate =
      recentPerfs.filter((p) => p.isSuccess && p.isValidCategory).length / 3;

    let performanceScore = 0;
    let timeAdjustment = 0;

    if (avgWordLength > 7) performanceScore += 2;
    else if (avgWordLength > 5) performanceScore += 1;

    if (avgTimeUsed < 5) performanceScore += 2;
    else if (avgTimeUsed < 8) performanceScore += 1;

    if (successRate === 1) performanceScore += 2;
    else if (successRate >= 0.66) performanceScore += 1;

    if (successRate < 0.33) timeAdjustment = 5;
    else if (successRate === 1 && avgTimeUsed < 5) timeAdjustment = -3;

    const difficulty =
      performanceScore >= 4
        ? "hard"
        : performanceScore >= 2
          ? "medium"
          : "easy";

    return { difficulty, timeAdjustment };
  };

  const getRandomStartingWord = (theme) => {
    const words = categoryValidation[theme];
    return words[Math.floor(Math.random() * words.length)];
  };

  const startGame = (theme) => {
    const initialWord = getRandomStartingWord(theme);
    setSelectedTheme(theme);
    setCurrentWord(initialWord);
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setBaseTimeLimit(15);
    setInput("");
    setMessage({ type: "", text: "" });
    setUsedWords(new Set([initialWord]));
    setCurrentDifficulty("medium");
    setRecentPerformances([]);
    setLastWordStartTime(Date.now());
  };

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setMessage({ type: "error", text: "Time's up! Game Over!" });
      handleEndGame(); // Call handleEndGame when time runs out
      setGameStarted(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted]);

  const handleSubmit = () => {
    const lastChar = currentWord.slice(-1);
    const userWord = input.toLowerCase().trim();
    const timeUsed = (Date.now() - lastWordStartTime) / 1000;

    if (userWord.length < 2) {
      setMessage({
        type: "error",
        text: "Word must be at least 2 letters long!",
      });
      return;
    }

    if (usedWords.has(userWord)) {
      setMessage({
        type: "error",
        text: "Word already used! Try another one.",
      });
      return;
    }

    const isValidForCategory = validateCategory(userWord, selectedTheme);

    if (!isValidForCategory) {
      setMessage({
        type: "error",
        text: `Invalid ${selectedTheme}! Please enter a valid ${selectedTheme.slice(0, -1)}!`,
      });
      return;
    }

    if (userWord.startsWith(lastChar)) {
      const performance = analyzeMovePerformance(
        userWord.length,
        timeUsed,
        true,
        isValidForCategory
      );
      const newPerformances = [...recentPerformances, performance];
      setRecentPerformances(newPerformances);

      if (newPerformances.length % 3 === 0) {
        const { difficulty, timeAdjustment } =
          adjustDifficulty(newPerformances);
        setCurrentDifficulty(difficulty);

        const newBaseTime = Math.min(
          Math.max(baseTimeLimit + timeAdjustment, 8),
          20
        );
        setBaseTimeLimit(newBaseTime);
      }

      setUsedWords((prev) => new Set([...prev, userWord]));
      setScore(score + userWord.length);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      setCurrentWord(userWord);
      setInput("");
      setTimeLeft(baseTimeLimit);
      setMessage({
        type: "success",
        text: `+${userWord.length} points! ${
          newPerformances.length % 3 === 0
            ? `Difficulty: ${currentDifficulty}, Time limit: ${baseTimeLimit}s! `
            : ""
        }Keep going!`,
      });
      setAnimation(true);
      setLastWordStartTime(Date.now());
    } else {
      const performance = analyzeMovePerformance(
        0,
        timeUsed,
        false,
        isValidForCategory
      );
      setRecentPerformances([...recentPerformances, performance]);
      setMessage({
        type: "error",
        text: `Word must start with '${lastChar}'!`,
      });
    }
  };

  useEffect(() => {
    if (animation) {
      setTimeout(() => setAnimation(false), 500);
    }
  }, [animation]);

  const DifficultyIcon = difficultyIcons[currentDifficulty];

  const handleEndGame = async () => {
    setGameStarted(false);

    if (!user || !user.id) {
      console.error("User information not available.");
      setMessage({
        type: "error",
        text: "Could not save game data: User ID is missing.",
      });
      return;
    }

    if (!gameStartTimeRef.current) {
      console.error("Game start time is not available.");
      setMessage({
        type: "error",
        text: "Could not save game data: Start time is missing.",
      });
      return;
    }

    const endTime = Date.now();
    const gameDuration = (endTime - gameStartTimeRef.current) / 1000;

    const gameData = {
      userId: user?.publicMetadata?.userId,
      theme: selectedTheme,
      score: score,
      streak: streak,
      wordsUsed: Array.from(usedWords),
      difficulty: currentDifficulty,
      timeLimit: baseTimeLimit,
      totalTimePlayed: gameDuration,
    };

    try {
      const result = await insertGameDetails(gameData);

      if (result.success) {
        console.log("Game data saved successfully!", result.achievements);
        setMessage({ type: "success", text: "Game saved successfully!" });
        setAchievements(result.achievements);
      } else {
        console.error("Error saving game data:", result.message);
        setMessage({
          type: "error",
          text: `Error saving game: ${result.message}`,
        });
      }
    } catch (error) {
      console.error("Failed to send data to server:", error);
      setMessage({ type: "error", text: "Failed to save game data." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      <motion.div
        className="container mx-auto px-4 py-8 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative mx-auto max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                Word Chain
              </h1>
              <p className="text-lg text-white/60">
                Connect words, build chains, score points!
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!gameStarted ? (
                <motion.div
                  key="theme-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="text-center space-y-6">
                    <h2 className="text-4xl font-bold text-white/90">
                      Choose Your Theme
                    </h2>
                    {bestStreak > 0 && (
                      <motion.div
                        className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400/10 rounded-full border border-yellow-400/20"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Trophy className="h-6 w-6 text-yellow-400" />
                        <span className="text-xl text-yellow-400 font-medium">
                          Best Streak: {bestStreak}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    className="grid grid-cols-3 gap-8"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {Object.keys(themeIcons).map((theme) => {
                      const ThemeIcon = themeIcons[theme];
                      return (
                        <motion.div
                          key={theme}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => startGame(theme)}
                            className="h-40 w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-white/10 rounded-2xl"
                          >
                            <div className="flex flex-col items-center gap-6">
                              <ThemeIcon className="h-16 w-16 text-white" />
                              <span className="text-2xl font-medium capitalize text-white/90">
                                {theme}
                              </span>
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="game-interface"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <motion.div
                    className="grid grid-cols-3 gap-6"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {[
                      {
                        icon: Sparkles,
                        value: score,
                        label: "Score",
                        color: "green",
                      },
                      {
                        icon: Star,
                        value: streak,
                        label: "Streak",
                        color: "yellow",
                      },
                      {
                        icon: Clock,
                        value: timeLeft,
                        label: "Seconds",
                        color: "pink",
                      },
                    ].map(({ icon: Icon, value, label, color }) => (
                      <motion.div
                        key={label}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <Icon className="h-8 w-8 text-white mb-3" />
                        <motion.div
                          className="text-3xl font-bold text-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          {value}
                        </motion.div>
                        <div className="text-lg text-white/60">{label}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {currentWord}
                    </motion.div>
                  </motion.div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={`Enter a ${selectedTheme?.slice(0, -1)} starting with '${currentWord.slice(-1)}'`}
                        className="h-14 flex-1 bg-white/5 border-white/10 text-white text-lg placeholder-white/40"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium"
                        >
                          Submit
                        </Button>
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {message.text && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <Alert
                            className={`${
                              message.type === "success"
                                ? "bg-green-500/10"
                                : "bg-red-500/10"
                            } border-white/10`}
                          >
                            {message.type === "success" ? (
                              <Check className="h-5 w-5 text-green-400" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-400" />
                            )}
                            <AlertDescription className="text-white/90 text-lg">
                              {message.text}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between text-lg text-white/60">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      {usedWords.size} words used
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      {selectedTheme}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleEndGame}
                      variant="outline"
                      className="h-14 bg-purple-500 hover:bg-purple-600 text-xl w-full border-white/10 text-white"
                    >
                      <XCircle className="h-6 w-6 mr-2" />
                      End Game
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WordChainGame;
