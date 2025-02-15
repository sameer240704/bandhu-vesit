"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Repeat, ArrowLeft } from "lucide-react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/ui/split-text";
import { motion, AnimatePresence } from "framer-motion";
import Waves from "@/components/ui/waves";

const GamePage = ({ onBack, gameState, onCardClick, getLevelConfig }) => {
  const config = getLevelConfig(gameState.level);

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

  const cardVariants = {
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

  const handleAnimationComplete = () => {
    console.log("Animation complete");
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col justify-center overflow-y-auto bg-gradient-to-br from-indigo-100 to-purple-100 p-4 relative">
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

      <SplitText
        text={`Level ${gameState.level}`}
        className="text-4xl font-serif mb-4 font-semibold text-center bg-[#160000]"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
        onLetterAnimationComplete={handleAnimationComplete}
      />

      <motion.div
        className="max-w-[95%] mx-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-white rounded-lg shadow-md p-4">
          <motion.div
            className="flex justify-between items-center mb-4"
            variants={cardVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              variants={cardVariants}
            >
              <motion.div
                className="flex items-center gap-1 bg-indigo-50 rounded-lg px-3 py-1 border border-indigo-200"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium">
                  Level {gameState.level}/10
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1 bg-purple-50 rounded-lg px-3 py-1 border border-purple-200"
                whileHover={{ scale: 1.05 }}
              >
                <Repeat className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">
                  Attempts {gameState.attempts}/{gameState.maxAttempts}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {gameState.showCelebration && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={200}
                recycle={false}
                className="fixed top-0 left-0 z-50"
              />
            )}
          </AnimatePresence>

          <div className="w-full flex justify-center">
            <motion.div
              className="grid gap-3 p-2 rounded-lg border border-indigo-100 bg-white/50"
              style={{
                gridTemplateColumns: `repeat(${config.grid.cols}, 1fr)`,
                width: `min(95vw, ${config.grid.cols * 8}rem)`,
                aspectRatio: `${config.grid.cols} / ${Math.ceil(gameState.cards.length / config.grid.cols)}`,
              }}
              variants={containerVariants}
            >
              {gameState.cards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`
                      aspect-square w-full flex items-center justify-center text-lg font-bold cursor-pointer
                      transition-all duration-300
                      ${
                        card.isFlipped || card.isMatched
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow border border-indigo-300"
                          : "bg-white hover:shadow border border-indigo-200 hover:border-indigo-300"
                      }
                      ${gameState.showCelebration && card.isMatched ? "animate-bounce" : ""}
                      rounded-lg
                    `}
                    onClick={() => onCardClick(card.id, card.isMatched)}
                  >
                    <motion.div
                      initial={false}
                      animate={{}}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      {card.isFlipped || card.isMatched ? (
                        <div className="">{card.value}</div>
                      ) : (
                        <div className="text-indigo-300 text-xl">?</div>
                      )}
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GamePage;
