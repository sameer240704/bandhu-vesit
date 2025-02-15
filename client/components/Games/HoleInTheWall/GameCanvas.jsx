import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GameCanvas = ({ videoRef, segmentationMask, onGameOver, showVideo }) => {
  const canvasRef = useRef(null);
  const [wallImage, setWallImage] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(null);
  
  const ANIMATION_DURATION = 3000; // 3 seconds
  const INITIAL_SCALE = 1.5;
  const FINAL_SCALE = 1.0;
  const INITIAL_OPACITY = 0;
  const FINAL_OPACITY = 1;

  useEffect(() => {
    // Load the wall image
    const img = new Image();
    img.src = '/cutouts/wall1.jpg'; // Update path to your wall image
    img.onload = () => setWallImage(img);
  }, []);

  useEffect(() => {
    if (showVideo && wallImage) {
      setGameStartTime(performance.now());
      requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [showVideo, wallImage]);

  const gameLoop = (timestamp) => {
    if (!gameStartTime) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const elapsed = timestamp - gameStartTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    // Calculate current animation values
    const currentScale = INITIAL_SCALE + progress * (FINAL_SCALE - INITIAL_SCALE);
    const currentOpacity = INITIAL_OPACITY + progress * (FINAL_OPACITY - INITIAL_OPACITY);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrored video feed if available
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

    // Draw wall with current animation parameters
    ctx.save();
    ctx.globalAlpha = currentOpacity;
    const scaledWidth = wallImage.width * currentScale;
    const scaledHeight = wallImage.height * currentScale;
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
      // Calculate score at the moment of impact
      calculateScore(x, y, scaledWidth, scaledHeight);
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
    <div className="relative w-full h-screen">
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={1280}
        height={720}
      />
    </div>
  );
};

export default GameCanvas; 