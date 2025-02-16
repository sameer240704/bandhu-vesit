"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Waves from "@/components/ui/waves";

const LevelsPage = ({ onNavigate, onBack }) => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const [unlockedLevels, setUnlockedLevels] = useState(1); // Default to level 1 unlocked

  useEffect(() => {
    // Load unlocked levels from local storage on component mount
    const savedUnlockedLevels = localStorage.getItem("memoryGame_unlockedLevels");
    if (savedUnlockedLevels) {
      setUnlockedLevels(parseInt(savedUnlockedLevels, 10));
    }
  }, []);

  const handleLevelSelect = (level) => {
    if (level <= unlockedLevels) {
      onNavigate("game", { level });
    }
  };

  useEffect(() => {
    // Save unlocked levels to local storage whenever it changes
    localStorage.setItem("unlockedLevels", unlockedLevels.toString());
  }, [unlockedLevels]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const levelVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 relative">
      <Waves
        lineColor="#B2A5FF"
        backgroundColor="#DAD2FF"
        waveSpeedX={0.07}
        waveSpeedY={0.05}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <motion.div
        className="w-full max-w-4xl h-1/4 bg-white rounded-2xl shadow-xl p-8 border-4 border-indigo-200 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={levelVariants}
        >
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonHoverVariants}
          >
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-indigo-600"
            >
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Select Level
          </motion.h2>
          <div className="w-24"></div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={containerVariants}
        >
          {levels.map((level) => (
            <motion.div
              key={level}
              variants={levelVariants}
              whileHover={level <= unlockedLevels ? "hover" : {}}
              whileTap={level <= unlockedLevels ? "tap" : {}}
            >
              <Button
                onClick={() => handleLevelSelect(level)}
                disabled={level > unlockedLevels}
                className={`
                 w-full h-full text-2xl font-bold border-2 border-[#B2A5FF] rounded-lg
                  ${
                    level <= unlockedLevels
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                      : "bg-white text-gray-500"
                  }
                `}
              >
                {level > unlockedLevels ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 + level * 0.1 }}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Lock className="w-8 h-8" />
                  </motion.div>
                ) : (
                  level
                )}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LevelsPage;
