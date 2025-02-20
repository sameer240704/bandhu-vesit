import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const ScoreDisplay = ({ score, highScore }) => {
  return (
    <div className="fixed top-4 right-4 bg-black/50 p-4 rounded-lg text-white">
      <div className="text-2xl font-bold mb-2">Current: {Math.round(score)}</div>
      <div className="text-xl">High Score: {Math.round(highScore)}</div>
    </div>
  );
};

export default ScoreDisplay; 