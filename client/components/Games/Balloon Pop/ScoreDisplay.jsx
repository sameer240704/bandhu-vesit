import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const ScoreDisplay = ({ score, highScore }) => {
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-70 p-2 rounded shadow">
      <div className="text-lg text-black">Score: {score}</div>
      <div className="text-sm text-gray-700">High Score: {highScore}</div>
    </div>
  );
};

export default ScoreDisplay; 