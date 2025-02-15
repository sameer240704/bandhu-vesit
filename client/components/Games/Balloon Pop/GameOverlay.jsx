import React, { useEffect, useRef } from 'react';
import { BalloonManager } from './BalloonSystem/BalloonManager';

const GameOverlay = ({ gameState, handLandmarks, onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const balloonManagerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Initialize or reset balloon manager when game state changes
    if (gameState === "playing") {
      console.log('Initializing balloon manager...'); // Debug log
      balloonManagerRef.current = new BalloonManager(canvas.width, canvas.height);
    }

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gameState === "playing" && balloonManagerRef.current) {
        const balloonManager = balloonManagerRef.current;
        
        // Update balloons
        balloonManager.update(timestamp);
        
        // Check for collisions with finger tips
        if (handLandmarks && handLandmarks.length > 0) {
          const fingerTips = handLandmarks.map(hand => {
            const indexTip = hand[8];
            return {
              x: (1 - indexTip.x) * canvas.width,
              y: indexTip.y * canvas.height
            };
          });
          
          const score = balloonManager.checkCollisions(fingerTips);
          if (score > 0) {
            onScoreUpdate(prev => prev + score);
          }
        }
        
        // Draw balloons
        balloonManager.draw(ctx);
        console.log('Number of balloons:', balloonManager.balloons.length); // Debug log
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (gameState !== "playing") {
        balloonManagerRef.current = null;
      }
    };
  }, [gameState, handLandmarks, onScoreUpdate]);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = 1280;
        canvasRef.current.height = 720;
        // Reinitialize balloon manager with new dimensions
        balloonManagerRef.current = new BalloonManager(
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      width={1280}
      height={720}
    />
  );
};

export default GameOverlay; 