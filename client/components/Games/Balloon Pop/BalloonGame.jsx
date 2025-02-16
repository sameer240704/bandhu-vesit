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

const GAME_CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  MAX_BALLOONS: 15,
  COLORS: [
    [255, 182, 193, 0.7], // Pastel Pink
    [147, 197, 253, 0.7], // Pastel Blue
    [255, 223, 186, 0.7], // Pastel Orange
    [207, 235, 176, 0.7], // Pastel Green
    [255, 255, 186, 0.7], // Pastel Yellow
    [221, 160, 221, 0.7], // Pastel Purple
  ],
  BASE_SPAWN_INTERVAL: 1,
  MIN_SPAWN_INTERVAL: 0.3,
  MISSED_PENALTY: 35,
};

class Balloon {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = Math.floor(Math.random() * 30 + 15);
    this.speed = Math.floor(Math.random() * 5 + 5);
    this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
    this.y = canvasHeight + this.radius;
    this.color =
      GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)];
    this.isPopped = false;
    this.drift = Math.random() * 1 - 0.5;
  }

  update(dt) {
    if (!this.isPopped) {
      this.y -= this.speed * dt;
      this.x += this.drift * dt * 60;

      // Bounce off walls with angle control
      if (this.x < this.radius) {
        this.drift = Math.abs(this.drift) * 0.5; // Reduce bounce angle
        this.x = this.radius;
      } else if (this.x > this.canvasWidth - this.radius) {
        this.drift = -Math.abs(this.drift) * 0.5; // Reduce bounce angle
        this.x = this.canvasWidth - this.radius;
      }
    }
  }

  checkCollision(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }
}

const useBalloonGame = (videoRef, canvasRef, handLandmarks, gameState) => {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const lastSpawn = useRef(Date.now());
  const spawnInterval = useRef(GAME_CONFIG.BASE_SPAWN_INTERVAL);

  useEffect(() => {
    let animationFrame;
    const ctx = canvasRef.current?.getContext("2d");

    const gameLoop = () => {
      if (!ctx || !videoRef.current) return;

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw video feed first
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        videoRef.current,
        -ctx.canvas.width,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.restore();

      // Only process game logic if playing
      if (gameState === "playing") {
        const now = Date.now();
        const dt = (now - lastSpawn.current) / 1000;

        // Spawn new balloons
        if (now - lastSpawn.current > spawnInterval.current * 1000) {
          setBalloons((prev) => [
            ...prev.slice(-GAME_CONFIG.MAX_BALLOONS),
            new Balloon(ctx.canvas.width, ctx.canvas.height),
          ]);
          lastSpawn.current = now;
          spawnInterval.current = Math.max(
            GAME_CONFIG.MIN_SPAWN_INTERVAL,
            GAME_CONFIG.BASE_SPAWN_INTERVAL - score * 0.0002
          );
        }

        // Update balloons
        setBalloons((prev) =>
          prev
            .map((balloon) => {
              balloon.update(dt);
              return balloon;
            })
            .filter((b) => !b.isPopped && b.y > -b.radius)
        );

        // Draw balloons first
        balloons.forEach((balloon) => {
          if (!balloon.isPopped) {
            ctx.beginPath();
            ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${balloon.color.join(",")})`;
            ctx.fill();
          }
        });

        // Draw hand landmarks after balloons
        if (handLandmarks) {
          handLandmarks.forEach((hand) => {
            hand.forEach((point, index) => {
              const x = (1 - point.x) * ctx.canvas.width;
              const y = point.y * ctx.canvas.height;

              // Draw index finger tip larger
              ctx.beginPath();
              ctx.arc(x, y, index === 8 ? 8 : 4, 0, Math.PI * 2);
              ctx.fillStyle =
                index === 8 ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 255, 0, 0.5)";
              ctx.fill();
              ctx.strokeStyle = "white";
              ctx.stroke();
            });
          });
        }

        // Collision detection (keep this separate)
        if (gameState === "playing" && handLandmarks) {
          handLandmarks.forEach((hand) => {
            const indexTip = hand[8];
            if (indexTip) {
              const fingerX = (1 - indexTip.x) * ctx.canvas.width;
              const fingerY = indexTip.y * ctx.canvas.height;

              setBalloons((prev) =>
                prev.map((balloon) => {
                  if (
                    !balloon.isPopped &&
                    balloon.checkCollision(fingerX, fingerY)
                  ) {
                    balloon.isPopped = true;
                    setScore(
                      (s) => s + Math.floor(balloon.speed / 10 + balloon.radius)
                    );
                    return { ...balloon };
                  }
                  return balloon;
                })
              );
            }
          });
        }
      }
    };

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameState, balloons, handLandmarks]);

  return { score, setScore };
};

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

  const { score: gameLoopScore } = useBalloonGame(
    videoRef,
    canvasRef,
    handLandmarksData,
    gameState
  );

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
