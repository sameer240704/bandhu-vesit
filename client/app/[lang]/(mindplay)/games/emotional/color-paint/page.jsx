"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StartMenu from "@/components/Games/Coloring Game/StartMenu";
import CategorySelect from "@/components/Games/Coloring Game/CategorySelect";
import LevelSelect from "@/components/Games/Coloring Game/LevelSelect";
import GamePage from "@/components/Games/Coloring Game/GamePage";
import { useRouter } from "next/navigation";

const ColoringGame = () => {
  const [gameState, setGameState] = useState("start");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);

  const unlockedLevels = [1, 2, 3];
  const router = useRouter();

  const handleStartClick = () => setGameState("categories");
  const handleExitClick = () => {
    router.back();
  };
  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setGameState("levels");
  };
  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setGameState("playing");
  };
  const handleBackToCategories = () => {
    setGameState("categories");
    setCurrentCategory(null);
  };
  const handleBackToLevels = () => {
    setGameState("levels");
    setCurrentLevel(null);
  };
  const handleBackToStart = () => {
    setGameState("start");
    setCurrentCategory(null);
    setCurrentLevel(null);
  };

  return (
    <AnimatePresence mode="wait">
      {gameState === "start" && (
        <StartMenu
          onStartClick={handleStartClick}
          onExitClick={handleExitClick}
        />
      )}
      {gameState === "categories" && (
        <CategorySelect
          onCategorySelect={handleCategorySelect}
          onBackToStart={handleBackToStart}
        />
      )}
      {gameState === "levels" && (
        <LevelSelect
          category={currentCategory}
          unlockedLevels={unlockedLevels}
          onLevelSelect={handleLevelSelect}
          onBackToCategories={handleBackToCategories}
        />
      )}

      {gameState === "playing" && currentLevel && (
        <GamePage
          level={currentLevel}
          category={currentCategory}
          onBackToLevels={handleBackToLevels}
        />
      )}
    </AnimatePresence>
  );
};

export default ColoringGame;
