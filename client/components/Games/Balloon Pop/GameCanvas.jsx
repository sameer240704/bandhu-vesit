import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Balloon } from "./Balloon";

const GameCanvas = ({
  videoRef,
  handLandmarks,
  onScoreUpdate,
  onGameOver,
  showVideo,
}) => {
  const canvasRef = useRef(null);
  const [balloons, setBalloons] = useState([]);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Set canvas dimensions on mount
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 1280;
      canvasRef.current.height = 720;
    }
  }, []);

  const generateBalloon = () => {
    if (!canvasRef.current || balloons.length >= 10) return;
    const newBalloon = new Balloon({
      x: Math.random() * (canvasRef.current.width - 50) + 25,
      y: canvasRef.current.height + 25,
      radius: Math.random() * 20 + 30,
      speed: Math.random() * 2 + 1,
    });
    setBalloons((prev) => [...prev, newBalloon]);
  };

  const animate = (time) => {
    if (!canvasRef.current) return;
    if (!previousTimeRef.current) {
      previousTimeRef.current = time;
    }
    const deltaTime = time - previousTimeRef.current;
    const ctx = canvasRef.current.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw video feed (mirrored) if showVideo flag is true
    if (videoRef.current) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        videoRef.current,
        -canvasRef.current.width,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctx.restore();
    }

    // Update and draw balloons
    setBalloons((prevBalloons) => {
      const updatedBalloons = prevBalloons
        .map((balloon) => {
          balloon.update(deltaTime);
          balloon.draw(ctx);
          return balloon;
        })
        .filter((balloon) => !balloon.isPopped && balloon.y > -balloon.radius);
      return updatedBalloons;
    });

    // Draw hand landmarks and check collisions
    if (handLandmarks && handLandmarks.length > 0) {
      handLandmarks.forEach((hand) => {
        hand.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            (1 - landmark.x) * canvasRef.current.width,
            landmark.y * canvasRef.current.height,
            3,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fill();
        });
        const indexTip = hand[8];
        if (indexTip) {
          const tipX = (1 - indexTip.x) * canvasRef.current.width;
          const tipY = indexTip.y * canvasRef.current.height;
          balloons.forEach((balloon) => {
            if (!balloon.isPopped && balloon.checkCollision(tipX, tipY)) {
              balloon.pop();
              onScoreUpdate((prev) => prev + Math.floor(balloon.radius));
            }
          });
        }
      });
    }

    // Occasionally generate a new balloon
    if (Math.random() < 0.02) {
      generateBalloon();
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start the animation loop once on mount
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // No dependencies so the loop runs continuously

  return (
    <div className="relative w-full h-screen">
      <video
        ref={videoRef}
        className="input_video"
        playsInline
        muted
        style={{ display: "none", pointerEvents: "none" }}
      />
      <canvas
        ref={canvasRef}
        className="output_canvas absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};

export default GameCanvas; 