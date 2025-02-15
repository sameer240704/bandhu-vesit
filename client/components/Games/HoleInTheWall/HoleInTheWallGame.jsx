import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GameCanvas from "./GameCanvas";
import StartMenu from "./StartMenu";
import GameOverDialog from "./GameOverDialog";
import ScoreDisplay from "./ScoreDisplay";
import { useMediaPipe } from "./hooks/useMediaPipe";
import ScriptLoader from "./ScriptLoader";
import PoseOverlay from './PoseOverlay';
import { GAME_CONFIG, WALLS } from './constants';
import WallSystem from './WallSystem';

const HoleInTheWallGame = () => {
  // gameState: "menu", "camera-setup", "tracking-setup", "preview", "matching", "gameOver"
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [currentWallIndex, setCurrentWallIndex] = useState(0);
  const [previewTimer, setPreviewTimer] = useState(GAME_CONFIG.PREVIEW_DURATION / 1000);
  const [matchingTimer, setMatchingTimer] = useState(GAME_CONFIG.MATCHING_DURATION / 1000);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const segmentationCanvasRef = useRef(null);
  const gameCanvasRef = useRef(null);
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
    setGameState("preview");
    setScore(0);
    setCurrentWallIndex(0);
    setPreviewTimer(GAME_CONFIG.PREVIEW_DURATION / 1000);
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

  // Preview Phase Timer
  useEffect(() => {
    if (gameState === "preview" && previewTimer > 0) {
      const timer = setInterval(() => {
        setPreviewTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === "preview") {
      setGameState("matching");
      setMatchingTimer(GAME_CONFIG.MATCHING_DURATION / 1000);
    }
  }, [gameState, previewTimer]);

  // Matching Phase Timer
  useEffect(() => {
    if (gameState === "matching" && matchingTimer > 0) {
      const timer = setInterval(() => {
        setMatchingTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === "matching") {
      evaluatePose();
    }
  }, [gameState, matchingTimer, segmentationMask]);

  const evaluatePose = () => {
    if (!segmentationMask?.poseLandmarks) {
      handleGameOver();
      return;
    }

    const currentWall = WALLS[currentWallIndex];
    const outline = currentWall.outline;

    // Function to check if a point is inside the polygon
    const isPointInPolygon = (point, polygon, tolerance = 0.05) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    // Evaluate pose
    const matchingJoints = GAME_CONFIG.BODY_JOINTS.filter(jointName => {
      const landmark = segmentationMask.poseLandmarks.find(lm => lm.name === jointName);
      if (!landmark) return false;

      return isPointInPolygon({ x: landmark.x, y: landmark.y }, outline);
    });

    const matchPercentage = matchingJoints.length / GAME_CONFIG.BODY_JOINTS.length;

    if (matchPercentage >= GAME_CONFIG.SUCCESS_THRESHOLD) {
      // Success
      setScore(prev => prev + GAME_CONFIG.SCORE_PER_WALL);
      if (currentWallIndex < WALLS.length - 1) {
        setCurrentWallIndex(prev => prev + 1);
        setGameState("preview");
        setPreviewTimer(GAME_CONFIG.PREVIEW_DURATION / 1000);
      } else {
        // Game won
        handleGameOver();
      }
    } else {
      // Game Over
      handleGameOver();
    }
  };

  const currentWall = WALLS[currentWallIndex];

  return (
    <>
      <ScriptLoader onLoad={handleScriptsLoaded} />

      {/* Add debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 bg-black/50 text-white p-2 text-sm z-[100]">
          Camera: {scriptsLoaded.camera ? '✅' : '❌'}<br />
          Controls: {scriptsLoaded.controls ? '✅' : '❌'}<br />
          Drawing: {scriptsLoaded.drawing ? '✅' : '❌'}<br />
          Pose: {scriptsLoaded.pose ? '✅' : '❌'}<br />
          Window.Pose: {window.Pose ? '✅' : '❌'}
        </div>
      )}

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

        {/* Game Phases */}
        {gameState === "preview" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
            <img src={currentWall.image} alt="Wall" className="max-w-full max-h-full" />
            <div className="absolute top-4 left-4 text-white text-2xl">
              Preview: {previewTimer}
            </div>
          </div>
        )}

        {gameState === "matching" && (
          <>
            <div className="absolute inset-0 z-30">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-10"
                style={{ transform: 'scaleX(-1)' }}
                playsInline
                autoPlay
                muted
              />
              <canvas
                ref={gameCanvasRef}
                className="absolute inset-0 w-full h-full z-20"
              />
              {/* Render the outline on the canvas */}
              {currentWall && (
                <OutlineRenderer
                  outline={currentWall.outline}
                  videoWidth={videoWidth}
                  videoHeight={videoHeight}
                />
              )}
              <div className="absolute top-4 left-4 text-white text-2xl">
                Match: {matchingTimer}
              </div>
            </div>
            <PoseOverlay
              landmarks={segmentationMask?.poseLandmarks}
              visible={true}
              videoWidth={videoWidth}
              videoHeight={videoHeight}
            />
          </>
        )}

        {gameState === "gameOver" && (
          <GameOverDialog score={score} onRetry={handleRetry} />
        )}

        {/* Video and Game Canvas */}
        <div className="relative w-full max-w-[1280px] mx-auto aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            style={{ 
              transform: 'scaleX(-1)',
              border: '4px solid red',
              filter: 'brightness(0.5)'
            }}
            playsInline
            autoPlay
            muted
          />
          
          {/* Segmentation Mask Canvas */}
          <canvas
            ref={segmentationCanvasRef}
            className="absolute inset-0 w-full h-full z-20"
          />
          
          {/* Pose Overlay */}
          <PoseOverlay
            landmarks={segmentationMask?.poseLandmarks}
            visible={gameState === 'playing'}
            videoWidth={videoWidth}
            videoHeight={videoHeight}
          />
          
          {/* Wall Game Canvas */}
          <canvas
            ref={gameCanvasRef}
            className="absolute inset-0 w-full h-full z-30"
          />
          
          {/* Score Display */}
          <ScoreDisplay score={score} />
        </div>
      </div>
    </>
  );
};

// OutlineRenderer Component
const OutlineRenderer = ({ outline, videoWidth, videoHeight }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !outline) return;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    outline.forEach((point, index) => {
      const x = point.x * videoWidth;
      const y = point.y * videoHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [outline, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-30"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default HoleInTheWallGame;
