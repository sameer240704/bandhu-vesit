import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Repeat } from "lucide-react";

const GameOverDialog = ({ score, highScore, onRetry }) => {
  const isNewHighScore = score > highScore;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-lg mb-2">Your score: {score}</p>
        <p className="text-sm mb-4">High score: {highScore}</p>
        <Button onClick={onRetry} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
          Retry
        </Button>
      </div>
    </div>
  );
};

export default GameOverDialog; 