import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const ScoreDisplay = ({ score }) => {
  const getScoreColor = () => {
    switch (score) {
      case "Perfect!":
        return "text-green-500";
      case "Great!":
        return "text-blue-500";
      case "Good!":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <span className={`text-2xl font-bold ${getScoreColor()}`}>
          {score}
        </span>
      </div>
    </motion.div>
  );
};

export default ScoreDisplay; 