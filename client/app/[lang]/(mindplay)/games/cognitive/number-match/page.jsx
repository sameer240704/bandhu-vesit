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

const MemoryMastery = () => {
  const navigation = useNavigationStack();
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
  });
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
  });
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      startTime: Date.now(),
    }));
  }, []);

  const initializeCards = (level) => {
    const config = getLevelConfig(level);

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
      maxAttempts: config.attempts,
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
            setUnlockedLevels((prev) => Math.max(prev, gameState.level + 1));
            setShowDialog(true);
          }
        } else {
          newCards[gameState.flippedCards[0]].isFlipped = false;
          newCards[id].isFlipped = false;

          setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            attempts: newAttempts,
            gameOver: newAttempts >= gameState.maxAttempts,
          }));

          if (newAttempts >= gameState.maxAttempts) {
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
            onUpdateSettings={setSettings}
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
