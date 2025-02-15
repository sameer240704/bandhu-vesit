import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Repeat } from 'lucide-react';

const GameOverDialog = ({ score, onRetry }) => {
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

  const getMessage = () => {
    switch (score) {
      case "Perfect!":
        return "Amazing! You nailed it!";
      case "Great!":
        return "Excellent pose matching!";
      case "Good!":
        return "Nice work! Keep practicing!";
      default:
        return "Don't worry, practice makes perfect!";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-md"
      >
        <div className="flex justify-center">
          <Trophy className={`w-16 h-16 ${score === "Perfect!" ? "text-yellow-500" : "text-gray-400"}`} />
        </div>

        <h2 className={`text-4xl font-bold ${getScoreColor()}`}>
          {score}
        </h2>

        <p className="text-xl text-gray-600">
          {getMessage()}
        </p>

        <div className="pt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
            >
              <Repeat className="w-6 h-6 mr-2" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverDialog; 