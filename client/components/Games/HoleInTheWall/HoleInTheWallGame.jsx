import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GameCanvas from "./GameCanvas";
import StartMenu from "./StartMenu";
import GameOverDialog from "./GameOverDialog";
import ScoreDisplay from "./ScoreDisplay";
import { useMediaPipe } from "./hooks/useMediaPipe";

const HoleInTheWallGame = () => {
  // gameState: "menu", "camera-setup", "tracking-setup", "playing", "gameOver"
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const {
    segmentationMask,
    initializeCamera,
    initializeHolistic,
    stopMediaPipe,
  } = useMediaPipe(videoRef);

  const handleStartCamera = async () => {
    try {
      setError(null);
      await initializeCamera();
      setGameState("camera-setup");
    } catch (err) {
      setError(
        "Failed to start camera. Please ensure camera permissions are granted."
      );
    }
  };

  const handleStartTracking = async () => {
    try {
      setError(null);
      await initializeHolistic();
      setGameState("tracking-setup");
    } catch (err) {
      setError("Failed to initialize pose tracking. Please try again.");
    }
  };

  const handleStartGame = () => {
    setGameState("playing");
    setScore(null);
  };

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
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

      {gameState === "menu" && <StartMenu onStart={handleStartCamera} />}

      {gameState === "camera-setup" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 relative"
          >
            <h2 className="text-2xl font-bold text-purple-600">
              Camera Ready!
            </h2>
            <p className="text-gray-600">
              Camera initialized. Ready to set up pose tracking?
            </p>
            <Button
              onClick={handleStartTracking}
              className="bg-purple-600 hover:bg-purple-700 text-white relative z-10"
            >
              Start Pose Tracking
            </Button>
          </motion.div>
        </div>
      )}

      {gameState === "tracking-setup" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-purple-600">
              Pose Tracking Ready!
            </h2>
            <p className="text-gray-600">
              Strike a pose to test the tracking, then start the game!
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

      {gameState === "playing" && score && <ScoreDisplay score={score} />}

      {gameState === "gameOver" && (
        <GameOverDialog score={score} onRetry={handleRetry} />
      )}

      {/* Always render GameCanvas so video element exists */}
      <GameCanvas
        videoRef={videoRef}
        segmentationMask={segmentationMask}
        onGameOver={handleGameOver}
        showVideo={gameState === "playing"}
      />
    </div>
  );
};

export default HoleInTheWallGame;
