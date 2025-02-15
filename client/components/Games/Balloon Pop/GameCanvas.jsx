import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Balloon } from "./Balloon";

const GameCanvas = ({
  videoRef,
  canvasRef,
  handLandmarks,
  onScoreUpdate,
  onGameOver,
  showVideo,
  gameState,
}) => {
  const [balloons, setBalloons] = useState([]);
  const animationRef = useRef();
  const lastSpawnTime = useRef(0);
  
  // Set canvas dimensions on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const viewportHeight = window.innerHeight * 0.8;
        const aspectRatio = 16 / 9;
        const width = viewportHeight * aspectRatio;
        
        canvasRef.current.width = width;
        canvasRef.current.height = viewportHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      
      // Only handle balloons if game is playing
      if (gameState === "playing") {
        // Spawn new balloon every 60 frames (about 1 second)
        if (frameCount % 60 === 0) {
          setBalloons(prev => {
            if (prev.length < 10) { // Max 10 balloons
              return [...prev, new Balloon(canvas.width, canvas.height)];
            }
            return prev;
          });
        }

        // Update balloon positions
        setBalloons(prev => 
          prev
            .map(balloon => {
              balloon.update();
              return balloon;
            })
            .filter(balloon => !balloon.isPopped && balloon.y > -balloon.radius)
        );

        // Check for collisions with finger
        if (handLandmarks && handLandmarks.length > 0) {
          handLandmarks.forEach(hand => {
            const indexTip = hand[8]; // Index fingertip
            if (indexTip) {
              const tipX = (1 - indexTip.x) * canvas.width;
              const tipY = indexTip.y * canvas.height;

              balloons.forEach(balloon => {
                if (!balloon.isPopped && balloon.checkCollision(tipX, tipY)) {
                  const points = balloon.pop();
                  onScoreUpdate(prev => prev + points);
                }
              });
            }
          });
        }
      }

      // Draw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw balloons
      balloons.forEach(balloon => balloon.draw(ctx));

      // Draw hand landmarks
      if (handLandmarks) {
        handLandmarks.forEach(hand => {
          hand.forEach((point, index) => {
            const x = (1 - point.x) * canvas.width;
            const y = point.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, index === 8 ? 8 : 4, 0, Math.PI * 2);
            ctx.fillStyle = index === 8 ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 255, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.stroke();
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, handLandmarks, onScoreUpdate]);

  return (
    <div className="flex justify-center items-center w-full h-screen p-4">
      <div className="relative w-full max-w-[1280px] aspect-video">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          autoPlay
          muted
          style={{ 
            transform: 'scaleX(-1)',
            display: 'block',
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundColor: 'transparent',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default GameCanvas; 