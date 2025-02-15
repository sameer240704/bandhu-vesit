// client/components/Games/Balloon Pop/BalloonGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GameCanvas from "./GameCanvas";
import StartMenu from "./StartMenu";
import GameOverDialog from "./GameOverDialog";
import ScoreDisplay from "./ScoreDisplay";
import Script from "next/script";
import { drawScene } from "./utils/drawScene";
import GameOverlay from "./GameOverlay";

const BalloonGame = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [hands, setHands] = useState(null);
  const [camera, setCamera] = useState(null);
  const [handLandmarksData, setHandLandmarksData] = useState(null);

  const handleStartCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setGameState("camera-setup");
      }
    } catch (err) {
      setError(
        "Failed to start camera. Please ensure camera permissions are granted."
      );
    }
  };

  const handleStartTracking = async () => {
    try {
      setError(null);

      if (!window.Hands) {
        throw new Error("MediaPipe Hands not loaded");
      }

      const handsInstance = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      await handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handsInstance.onResults((results) => {
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            drawScene(ctx, videoRef.current, results, balloons);

            // Store hand landmarks data
            setHandLandmarksData(results.multiHandLandmarks);
          }
        }
      });

      const cameraInstance = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await handsInstance.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });

      setHands(handsInstance);
      setCamera(cameraInstance);
      await cameraInstance.start();
      setGameState("tracking-setup");
    } catch (err) {
      console.error("Hand tracking error:", err);
      setError("Failed to initialize hand tracking. Please try again.");
    }
  };

  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
    setBalloons([]);
  };

  const handleGameOver = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameState("gameOver");

    // Clean up MediaPipe
    if (camera) {
      camera.stop();
    }
    if (hands) {
      hands.close();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [camera, hands]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
        strategy="beforeInteractive"
      />

      <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 z-0 overflow-hidden">
        {error && (
          <div className="absolute top-4 left-4 right-4 z-[60] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="absolute inset-0 z-10">
          <GameCanvas
            videoRef={videoRef}
            canvasRef={canvasRef}
            handLandmarks={handLandmarksData}
            onScoreUpdate={setScore}
            onGameOver={handleGameOver}
            showVideo={true}
            balloons={balloons}
            setBalloons={setBalloons}
            gameState={gameState}
          />
          <GameOverlay
            gameState={gameState}
            handLandmarks={handLandmarksData}
            onScoreUpdate={setScore}
          />
        </div>

        <div className="relative w-full h-full flex justify-center items-center` z-50">
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
                <h2 className="text-2xl font-bold text-purple-600">
                  Camera Ready!
                </h2>
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
            <div className="z-50">
              <ScoreDisplay score={score} highScore={highScore} />
            </div>
          )}

          {gameState === "gameOver" && (
            <div className="absolute inset-0 z-50">
              <GameOverDialog
                score={score}
                highScore={highScore}
                onRetry={handleStartGame}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BalloonGame;
