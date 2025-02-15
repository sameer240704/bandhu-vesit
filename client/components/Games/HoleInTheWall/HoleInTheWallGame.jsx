import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StartMenu from "./StartMenu";
import GameOverDialog from "./GameOverDialog";
import { useMediaPipe } from "./hooks/useMediaPipe";
import ScriptLoader from "./ScriptLoader";
import PoseOverlay from './PoseOverlay';
import { GAME_CONFIG, WALLS } from './constants';
import GamePhaseManager from './GamePhaseManager';

const HoleInTheWallGame = () => {
  // gameState: "menu", "camera-setup", "tracking-setup", "playing", "gameOver"
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({
    camera: false,
    controls: false,
    drawing: false,
    pose: false
  });
  const [videoWidth, setVideoWidth] = useState(1280);
  const [videoHeight, setVideoHeight] = useState(720);

  const {
    segmentationMask,
    initializeCamera,
    initializeHolistic,
    stopMediaPipe,
  } = useMediaPipe(videoRef);

  // Check if all required scripts are loaded
  const isMediaPipeLoaded = Object.values(scriptsLoaded).every(Boolean);

  useEffect(() => {
    // Debug script loading
    console.log('Current script loading status:', scriptsLoaded);
  }, [scriptsLoaded]);

  useEffect(() => {
    if (videoRef.current) {
      setVideoWidth(videoRef.current.videoWidth);
      setVideoHeight(videoRef.current.videoHeight);
    }
  }, [videoRef.current?.videoWidth, videoRef.current?.videoHeight]);

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
      if (!isMediaPipeLoaded) {
        throw new Error('MediaPipe is not loaded yet. Please wait...');
      }
      if (!window.Pose) {
        throw new Error('MediaPipe Pose is not initialized yet. Please refresh the page.');
      }
      await initializeHolistic();
      setGameState("tracking-setup");
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message);
    }
  };

  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentLevel(1);
    setIsPlaying(true);
  };

  const handleLevelComplete = () => {
    setScore(prev => prev + GAME_CONFIG.SCORE_PER_LEVEL);
    setCurrentLevel(prev => prev + 1);
  };

  const handleGameOver = () => {
    setGameState("gameOver");
    stopMediaPipe();
  };

  const handleRetry = () => {
    setGameState("menu");
  };

  const handleScriptsLoaded = () => {
    console.log('All scripts loaded');
    setScriptsLoaded({
      camera: true,
      controls: true,
      drawing: true,
      pose: true
    });
  };

  return (
    <>
      <ScriptLoader onLoad={handleScriptsLoaded} />

      <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
        {error && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add loading indicator when scripts are loading */}
        {!isMediaPipeLoaded && gameState !== "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-xl font-bold text-purple-600">Loading MediaPipe...</h2>
              <p className="text-gray-600 mt-2">Please wait while we initialize the tracking system.</p>
            </div>
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

        {/* Main Game Content */}
        <div className="relative w-full max-w-[1280px] mx-auto aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              transform: 'scaleX(-1)',
              filter: 'brightness(1.1) contrast(1.1)'
            }}
            playsInline
            autoPlay
            muted
          />
          
          <PoseOverlay
            landmarks={segmentationMask?.poseLandmarks}
            videoWidth={videoRef.current?.videoWidth}
            videoHeight={videoRef.current?.videoHeight}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {gameState === "playing" && (
          <div className="absolute inset-0 z-20">
            {/* Game Phase Manager */}
            <GamePhaseManager
              poseLandmarks={segmentationMask?.poseLandmarks}
              onSuccess={handleLevelComplete}
              onFail={handleGameOver}
            />
            
            {/* Score Display */}
            <div className="absolute top-4 right-4 bg-black/50 text-white p-4 rounded-lg text-xl font-bold z-40">
              Level: {currentLevel} | Score: {score}
            </div>
          </div>
        )}

        {gameState === "gameOver" && (
          <GameOverDialog score={score} onRetry={handleRetry} />
        )}
      </div>
    </>
  );
};

export default HoleInTheWallGame;
