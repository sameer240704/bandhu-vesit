import React, { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from './constants';
import { Wall1 } from '@/public/images';

const WallSystem = ({ poseLandmarks, onWallPassed, onGameOver, videoWidth, videoHeight }) => {
  const [wallOpacity, setWallOpacity] = useState(0);
  const [score, setScore] = useState(0);
  const wallImageRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Load wall image once
    const img = new Image();
    img.src = Wall1;
    img.onload = () => {
      wallImageRef.current = img;
      startTimeRef.current = performance.now();
      animateWall();
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const animateWall = (timestamp) => {
    if (!startTimeRef.current) return;
    
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / GAME_CONFIG.WALL_DURATION, 1);
    
    // Fade in first second
    const fadeProgress = Math.min(elapsed / GAME_CONFIG.WALL_FADE_IN, 1);
    setWallOpacity(fadeProgress);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateWall);
    } else {
      checkCollision();
      // Reset for next wall
      startTimeRef.current = performance.now();
      setScore(prev => prev + GAME_CONFIG.SCORE_PER_WALL);
      onWallPassed();
    }
  };

  const checkCollision = () => {
    if (!wallImageRef.current || !poseLandmarks) {
      onGameOver();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = wallImageRef.current.width;
    canvas.height = wallImageRef.current.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(wallImageRef.current, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const collision = poseLandmarks.some(landmark => {
      const x = Math.floor(landmark.x * canvas.width);
      const y = Math.floor(landmark.y * canvas.height);
      const pixelIndex = (y * canvas.width + x) * 4;
      
      return (
        imageData.data[pixelIndex] < GAME_CONFIG.SAFE_COLOR_THRESHOLD ||
        imageData.data[pixelIndex + 1] < GAME_CONFIG.SAFE_COLOR_THRESHOLD ||
        imageData.data[pixelIndex + 2] < GAME_CONFIG.SAFE_COLOR_THRESHOLD
      );
    });

    if (collision) onGameOver();
  };

  return (
    <div className="absolute inset-0 w-full h-full z-30">
      <canvas
        ref={canvas => {
          if (!canvas || !wallImageRef.current) return;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Temporary red overlay
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.globalAlpha = 1; // Force full visibility for debugging
          ctx.drawImage(
            wallImageRef.current,
            0, 0, wallImageRef.current.width, wallImageRef.current.height,
            0, 0, videoWidth, videoHeight
          );
        }}
        className="w-full h-full"
      />
    </div>
  );
};

export default WallSystem; 