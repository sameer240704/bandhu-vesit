"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Settings } from "lucide-react";
import Waves from "@/components/ui/waves";
import { motion } from "framer-motion";

const HomePage = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  const logoVariants = {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
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
        className="z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border-4 border-indigo-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-12"
          variants={itemVariants}
        >
          <motion.div
            variants={logoVariants}
            whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
          >
            <Brain className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Memory Mastery
          </motion.h1>
        </motion.div>

        <motion.div
          className="flex flex-col w-full items-center gap-4"
          variants={containerVariants}
        >
          <motion.div
            className="w-1/2"
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => onNavigate("levels")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xl py-6 w-full"
            >
              Start Game
            </Button>
          </motion.div>

          <motion.div
            className="w-1/2"
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => onNavigate("settings")}
              variant="outline"
              className="text-xl py-6 w-full"
            >
              <Settings className="mr-2" /> Settings
            </Button>
          </motion.div>

          <motion.div
            className="w-1/2"
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => window.close()}
              variant="outline"
              className="text-xl w-full py-6 text-white bg-red-500 hover:bg-red-600 active:bg-red-700 hover:text-white"
            >
              Exit
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
