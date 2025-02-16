"use client";
import React, { useState, useEffect } from "react";
import HomePage from "@/components/Games/Memory Game/HomePage";
import LevelsPage from "@/components/Games/Memory Game/LevelsPage";
import GamePage from "@/components/Games/Memory Game/GamePage";
import SettingsPage from "@/components/Games/Memory Game/SettingsPage";
import GameOverDialog from "@/components/Games/Memory Game/GameOverDialog";
import { getLevelConfig } from "@/constants/MemoryGame/gameConfig";

const PAGES = {
  HOME: "home",
  LEVELS: "levels",
  GAME: "game",
  SETTINGS: "settings",
};

const STORAGE_KEYS = {
  UNLOCKED_LEVELS: "memoryGame_unlockedLevels",
  LEVEL_PERFORMANCE: "memoryGame_levelPerformance",
  SETTINGS: "memoryGame_settings",
};

const getStoredData = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStoredData = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const useNavigationStack = () => {
  const [stack, setStack] = useState(["home"]);

  const push = (page) => {
    setStack((prev) => [...prev, page]);
  };

  const pop = () => {
    if (stack.length > 1) {
      setStack((prev) => prev.slice(0, -1));
      return stack[stack.length - 2];
    }
    return stack[0];
  };

  return { stack, push, pop, current: stack[stack.length - 1] };
};

const calculateDynamicAttempts = (currentLevel, previousPerformance) => {
  if (currentLevel === 1) return getLevelConfig(1).attempts;
  const lastPerformance = previousPerformance[currentLevel - 2];
  if (!lastPerformance) return getLevelConfig(currentLevel).attempts;

  const baseAttempts = getLevelConfig(currentLevel).attempts;
  const attemptRatio =
    lastPerformance.attemptsUsed / lastPerformance.baseAttempts;
  const timePerMove = lastPerformance.timeTaken / lastPerformance.attemptsUsed;
  const accuracyScore = lastPerformance.accuracy;

  const performanceScore =
    attemptRatio * 0.4 + timePerMove * 0.3 + (1 - accuracyScore) * 0.3;

  let adjustmentFactor = 1;
  if (performanceScore < 0.5) {
    adjustmentFactor = 0.85;
  } else if (performanceScore < 0.7) {
    adjustmentFactor = 0.92;
  } else if (performanceScore > 0.9) {
    adjustmentFactor = 1.15;
  } else if (performanceScore > 1.1) {
    adjustmentFactor = 1.25;
  }

  const adjustedAttempts = Math.round(baseAttempts * adjustmentFactor);
  const minAttempts = Math.ceil(baseAttempts * 0.75);
  const maxAttempts = Math.ceil(baseAttempts * 1.5);

  return Math.min(Math.max(adjustedAttempts, minAttempts), maxAttempts);
};

const MemoryMastery = () => {
  const navigation = useNavigationStack();
  const [levelPerformance, setLevelPerformance] = useState([]);
  const [gameState, setGameState] = useState({
    level: 1,
    cards: [],
    flippedCards: [],
    attempts: 0,
    maxAttempts: 10,
    matchedPairs: 0,
    gameOver: false,
    gameWon: false,
    showCelebration: false,
    startTime: 0,
    baseAttempts: 10,
  });
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
  });
  const [showDialog, setShowDialog] = useState(false);

  // Load saved data on initial mount
  useEffect(() => {
    const storedUnlockedLevels = getStoredData(STORAGE_KEYS.UNLOCKED_LEVELS, 1);
    const storedLevelPerformance = getStoredData(
      STORAGE_KEYS.LEVEL_PERFORMANCE,
      []
    );
    const storedSettings = getStoredData(STORAGE_KEYS.SETTINGS, {
      soundEnabled: true,
      musicEnabled: true,
    });

    setUnlockedLevels(storedUnlockedLevels);
    setLevelPerformance(storedLevelPerformance);
    setSettings(storedSettings);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    setStoredData(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Save unlocked levels whenever they change
  useEffect(() => {
    setStoredData(STORAGE_KEYS.UNLOCKED_LEVELS, unlockedLevels);
  }, [unlockedLevels]);

  // Save level performance whenever it changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.LEVEL_PERFORMANCE, levelPerformance);
  }, [levelPerformance]);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      startTime: Date.now(),
    }));
  }, []);

  const initializeCards = (level) => {
    const config = getLevelConfig(level);
    const dynamicAttempts = calculateDynamicAttempts(level, levelPerformance);

    const values = Array.from({ length: config.pairs }, (_, i) => i + 1);
    const pairs = [...values, ...values];
    const shuffled = pairs.sort(() => Math.random() - 0.5);

    setGameState((prev) => ({
      ...prev,
      cards: shuffled.map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      })),
      maxAttempts: dynamicAttempts,
      baseAttempts: config.attempts,
      attempts: 0,
      matchedPairs: 0,
      flippedCards: [],
      gameOver: false,
      gameWon: false,
      showCelebration: false,
    }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        startTime: Date.now(),
      }));
    }, 0);
  };

  const saveLevelPerformance = () => {
    const timeTaken = Date.now() - gameState.startTime;
    const accuracy = gameState.matchedPairs / (gameState.attempts || 1);

    const performance = {
      attemptsUsed: gameState.attempts,
      baseAttempts: gameState.baseAttempts,
      timeTaken,
      accuracy,
    };

    setLevelPerformance((prev) => {
      const newPerformance = [...prev];
      newPerformance[gameState.level - 1] = performance;
      setStoredData(STORAGE_KEYS.LEVEL_PERFORMANCE, newPerformance);
      return newPerformance;
    });
  };

  const handleUnlockLevel = (level) => {
    setUnlockedLevels((prev) => {
      const newValue = Math.max(prev, level);
      setStoredData(STORAGE_KEYS.UNLOCKED_LEVELS, newValue);
      return newValue;
    });
  };

  const handleCardClick = (id) => {
    if (
      gameState.gameOver ||
      gameState.gameWon ||
      gameState.flippedCards.length === 2 ||
      gameState.cards[id].isFlipped ||
      gameState.cards[id].isMatched
    ) {
      return;
    }

    const newCards = [...gameState.cards];
    newCards[id].isFlipped = true;

    setGameState((prev) => ({
      ...prev,
      cards: newCards,
      flippedCards: [...prev.flippedCards, id],
    }));

    if (gameState.flippedCards.length === 1) {
      const firstCard = gameState.cards[gameState.flippedCards[0]];
      const secondCard = gameState.cards[id];

      setTimeout(() => {
        const newCards = [...gameState.cards];
        const newAttempts = gameState.attempts + 1;
        let newMatchedPairs = gameState.matchedPairs;

        if (firstCard.value === secondCard.value) {
          newCards[gameState.flippedCards[0]].isMatched = true;
          newCards[id].isMatched = true;
          newMatchedPairs++;

          const isLevelComplete =
            newMatchedPairs === getLevelConfig(gameState.level).pairs;

          setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            attempts: newAttempts,
            gameWon: isLevelComplete,
            showCelebration: isLevelComplete,
          }));

          if (isLevelComplete) {
            saveLevelPerformance();
            handleUnlockLevel(gameState.level + 1);
            setShowDialog(true);
          }
        } else {
          newCards[gameState.flippedCards[0]].isFlipped = false;
          newCards[id].isFlipped = false;

          const isGameOver = newAttempts >= gameState.maxAttempts;

          setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            attempts: newAttempts,
            gameOver: isGameOver,
          }));

          if (isGameOver) {
            saveLevelPerformance();
            setShowDialog(true);
          }
        }
      }, 1000);
    }
  };

  const handleNavigate = (page, params = {}) => {
    if (page === PAGES.GAME) {
      setGameState((prev) => ({
        ...prev,
        level: params.level || prev.level,
      }));
      initializeCards(params.level || gameState.level);
    }
    navigation.push(page);
  };

  const handleBack = () => {
    const prevPage = navigation.pop();
    if (prevPage === PAGES.HOME) {
      setGameState((prev) => ({
        ...prev,
        level: 1,
      }));
    }
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    setStoredData(STORAGE_KEYS.SETTINGS, newSettings);
  };

  useEffect(() => {
    if (navigation.current === PAGES.GAME) {
      initializeCards(gameState.level);
    }
  }, [navigation.current === PAGES.GAME]);

  const renderPage = () => {
    switch (navigation.current) {
      case PAGES.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case PAGES.LEVELS:
        return (
          <LevelsPage
            onNavigate={handleNavigate}
            onBack={handleBack}
            unlockedLevels={unlockedLevels}
          />
        );
      case PAGES.GAME:
        return (
          <GamePage
            onBack={handleBack}
            gameState={gameState}
            onCardClick={handleCardClick}
            getLevelConfig={getLevelConfig}
          />
        );
      case PAGES.SETTINGS:
        return (
          <SettingsPage
            onNavigate={handleNavigate}
            onBack={handleBack}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderPage()}
      <GameOverDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        isVictory={gameState.gameWon}
        onNextLevel={() => {
          setShowDialog(false);
          handleNavigate(PAGES.GAME, { level: gameState.level + 1 });
        }}
        onRetry={() => {
          setShowDialog(false);
          initializeCards(gameState.level);
        }}
        onHome={() => {
          setShowDialog(false);
          handleNavigate(PAGES.HOME);
        }}
      />
    </>
  );
};

export default MemoryMastery;
