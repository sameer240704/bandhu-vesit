import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG, POSE_CONNECTIONS } from './constants';
import { Wall1 } from '@/public/images';

const GameCanvas = ({ videoRef, segmentationMask, onGameOver, showVideo, gameState }) => {
  const canvasRef = useRef(null);
  const [wallImage, setWallImage] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(null);
  
  // Set canvas dimensions on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const viewportHeight = window.innerHeight * 0.8;
        const aspectRatio = 16 / 9; // Changed to match BalloonGame
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
    // Load the wall image
    const img = new Image();
    img.src = Wall1;
    img.onload = () => setWallImage(img);
  }, []);

  useEffect(() => {
    if (showVideo && wallImage && gameState === 'playing') {
      setGameStartTime(performance.now());
      const frame = requestAnimationFrame(gameLoop);
      setAnimationFrame(frame);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [showVideo, wallImage, gameState]);

  const gameLoop = (timestamp) => {
    if (!gameStartTime || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const elapsed = timestamp - gameStartTime;
    const progress = Math.min(elapsed / GAME_CONFIG.ANIMATION_DURATION, 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrored video feed
    if (videoRef.current) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        videoRef.current,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();
    }

    // Draw wall with animation
    if (wallImage) {
      ctx.save();
      ctx.globalAlpha = progress;
      const scaledWidth = wallImage.width * progress;
      const scaledHeight = wallImage.height * progress;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      ctx.drawImage(wallImage, x, y, scaledWidth, scaledHeight);
      ctx.restore();

      // Draw player silhouette
      if (segmentationMask) {
        ctx.save();
        ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Check if animation is complete
      if (progress < 1) {
        const frame = requestAnimationFrame(gameLoop);
        setAnimationFrame(frame);
      } else {
        calculateScore(x, y, scaledWidth, scaledHeight);
      }
    }

    // Draw pose landmarks LAST so they appear on top
    if (segmentationMask?.poseLandmarks) {
      ctx.save();
      // Draw connectors
      if (window.drawConnectors && POSE_CONNECTIONS) {
        window.drawConnectors(
          ctx, 
          segmentationMask.poseLandmarks, 
          POSE_CONNECTIONS,
          { color: 'white', lineWidth: 4 }
        );
      }
      // Draw landmarks
      if (window.drawLandmarks) {
        window.drawLandmarks(
          ctx, 
          segmentationMask.poseLandmarks,
          { color: 'red', lineWidth: 2, radius: 6 }
        );
      }
      ctx.restore();
    }
  };

  const calculateScore = (wallX, wallY, wallWidth, wallHeight) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create offscreen canvas for wall cutout
    const offCanvasWall = document.createElement('canvas');
    offCanvasWall.width = canvas.width;
    offCanvasWall.height = canvas.height;
    const offCtxWall = offCanvasWall.getContext('2d');
    offCtxWall.drawImage(wallImage, wallX, wallY, wallWidth, wallHeight);
    const wallData = offCtxWall.getImageData(0, 0, canvas.width, canvas.height);

    // Create offscreen canvas for segmentation mask
    const offCanvasSeg = document.createElement('canvas');
    offCanvasSeg.width = canvas.width;
    offCanvasSeg.height = canvas.height;
    const offCtxSeg = offCanvasSeg.getContext('2d');
    if (segmentationMask) {
      offCtxSeg.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);
    }
    const segData = offCtxSeg.getImageData(0, 0, canvas.width, canvas.height);

    // Calculate match percentage
    let totalCutout = 0;
    let matchedPixels = 0;

    for (let i = 0; i < wallData.data.length; i += 4) {
      const r = wallData.data[i];
      const g = wallData.data[i + 1];
      const b = wallData.data[i + 2];
      
      if (r > 245 && g > 245 && b > 245) { // White pixel in wall cutout
        totalCutout++;
        const segVal = segData.data[i];
        if (segVal > 128) { // Player is present at this pixel
          matchedPixels++;
        }
      }
    }

    const percentage = totalCutout > 0 ? (matchedPixels / totalCutout) * 100 : 0;
    let score;
    
    if (percentage > 95) score = "Perfect!";
    else if (percentage > 85) score = "Great!";
    else if (percentage > 70) score = "Good!";
    else score = "Try Again!";

    onGameOver(score);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen p-4">
      <div className="relative w-full max-w-[1280px] aspect-video z-50">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
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
          className="absolute inset-0 w-full h-full z-20"
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