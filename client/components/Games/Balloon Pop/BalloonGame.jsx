// client/components/Games/Balloon Pop/BalloonGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GameCanvas from "./GameCanvas";
import StartMenu from "./StartMenu";
import GameOverDialog from "./GameOverDialog";
import ScoreDisplay from "./ScoreDisplay";
import { useMediaPipe } from "./hooks/useMediaPipe";

const BalloonGame = () => {
  // gameState: "menu", "camera-setup", "tracking-setup", "playing", "gameOver"
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const { handLandmarks, initializeCamera, initializeHandTracking, stopMediaPipe } = useMediaPipe(videoRef);

  const handleStartCamera = async () => {
    try {
      setError(null);
      await initializeCamera();
      setGameState("camera-setup");
    } catch (err) {
      setError("Failed to start camera. Please ensure camera permissions are granted.");
    }
  };

  const handleStartTracking = async () => {
    try {
      setError(null);
      await initializeHandTracking();
      setGameState("tracking-setup");
    } catch (err) {
      setError("Failed to initialize hand tracking. Please try again.");
    }
  };

  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
  };

  const handleGameOver = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameState("gameOver");
    stopMediaPipe();
  };

  const handleRetry = () => {
    setGameState("menu");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {gameState === "menu" && (
        <StartMenu onStart={handleStartCamera} highScore={highScore} />
      )}

      {gameState === "camera-setup" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-purple-600">Camera Ready!</h2>
            <p className="text-gray-600">
              Camera initialized. Ready to set up hand tracking?
            </p>
            <Button
              onClick={handleStartTracking}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Start Hand Tracking
            </Button>
          </motion.div>
        </div>
      )}

      {gameState === "tracking-setup" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-purple-600">
              Hand Tracking Ready!
            </h2>
            <p className="text-gray-600">
              Wave your hand to test the tracking, then start the game!
            </p>
            <Button
              onClick={handleStartGame}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Start Game
            </Button>
          </motion.div>
        </div>
      )}

      {gameState === "playing" && (
        <ScoreDisplay score={score} highScore={highScore} />
      )}

      {gameState === "gameOver" && (
        <GameOverDialog
          score={score}
          highScore={highScore}
          onRetry={handleRetry}
        />
      )}

      {/* Always render GameCanvas so that the video element exists */}
      <GameCanvas
        videoRef={videoRef}
        handLandmarks={handLandmarks}
        onScoreUpdate={setScore}
        onGameOver={handleGameOver}
        showVideo={gameState === "playing"}
      />
    </div>
  );
};

export default BalloonGame;