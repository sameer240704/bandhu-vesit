import React, { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, WALLS } from './constants';

const GamePhaseManager = ({ poseLandmarks, onSuccess, onFail }) => {
  const [wallOpacity, setWallOpacity] = useState(0);
  const [currentWall, setCurrentWall] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.WALL_DURATION/1000);
  const wallDataRef = useRef({
    whitePixels: new Set(),
    width: 0,
    height: 0
  });
  const startTimeRef = useRef(Date.now());
  const animationRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const gameActiveRef = useRef(true);

  // Modify the useEffect hook to set gameActiveRef to true on mount and false on unmount
  useEffect(() => {
    gameActiveRef.current = true;
    return () => {
      gameActiveRef.current = false;
    };
  }, []);

  // Load and process wall image
  useEffect(() => {
    const img = new Image();
    img.src = WALLS[currentWall].image;
    img.onload = () => {
      setIsImageLoaded(true);
      setTimeout(() => { // Defer image processing
        processWallImage(img);
        startFadeAnimation();
      }, 0);
    };
    img.onerror = () => {
      console.error('Failed to load wall image:', WALLS[currentWall].image);
      setIsImageLoaded(false);
      // Fallback to empty image
      setTimeout(() => { // Defer image processing
        processWallImage(new Image());
        startFadeAnimation();
      }, 0);
    };
  }, [currentWall]);

  const processWallImage = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const pixels = new Set();
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i] > GAME_CONFIG.WHITE_PIXEL_THRESHOLD &&
            imageData.data[i+1] > GAME_CONFIG.WHITE_PIXEL_THRESHOLD &&
            imageData.data[i+2] > GAME_CONFIG.WHITE_PIXEL_THRESHOLD) {
          pixels.add(`${x},${y}`);
        }
      }
    }
    
    wallDataRef.current = {
      whitePixels: pixels,
      width: img.width,
      height: img.height
    };
  };

  const startFadeAnimation = () => {
    startTimeRef.current = Date.now();
    cancelAnimationFrame(animationRef.current);
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / GAME_CONFIG.WALL_DURATION, 1);
      setWallOpacity(progress);
      setTimeRemaining(Math.ceil((GAME_CONFIG.WALL_DURATION - elapsed)/1000));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        checkPoseCollision();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const checkPoseCollision = () => {
    if (!gameActiveRef.current) {
      return;
    }

    if (!poseLandmarks) {
      onFail();
      return;
    }

    const allSafe = Object.values(poseLandmarks).every(landmark => {
      if (!landmark || landmark.visibility < 0.5) return true;

      const x = Math.floor(landmark.x * wallDataRef.current.width);
      const y = Math.floor(landmark.y * wallDataRef.current.height);

      // Check with 5px tolerance
      for (let dx = -5; dx <= 5; dx++) {
        for (let dy = -5; dy <= 5; dy++) {
          if (wallDataRef.current.whitePixels.has(`${x + dx},${y + dy}`)) {
            return true;
          }
        }
      }
      return false;
    });

    allSafe ? handleSuccess() : onFail();
  };

  const handleSuccess = () => {
    onSuccess();
    setCurrentWall(prev => (prev + 1) % WALLS.length);
    startTimeRef.current = Date.now() - (GAME_CONFIG.WALL_DURATION * 0.2); // Reduce time by 20%
    startFadeAnimation();
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {isImageLoaded && (
        <img 
          src={WALLS[currentWall].image}
          className="absolute w-full h-full object-cover wall-transition"
          style={{
            opacity: wallOpacity,
            transform: 'scaleX(-1)'
          }}
          alt="Safety wall pattern"
        />
      )}
      
      {!isImageLoaded && (
        <div className="text-white text-lg">
          Loading wall pattern...
        </div>
      )}

      <div className="absolute top-4 left-4 text-white text-4xl font-bold z-40">
        {timeRemaining}s
      </div>
    </div>
  );
};

export default GamePhaseManager; 