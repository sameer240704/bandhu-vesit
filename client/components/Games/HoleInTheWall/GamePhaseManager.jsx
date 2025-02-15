import React, { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from './constants';
import { Wall1 } from '@/public/images';

const GamePhaseManager = ({ poseLandmarks, onSuccess, onFail }) => {
  const [phase, setPhase] = useState('preview');
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.PREVIEW_DURATION);
  const [whitePixels, setWhitePixels] = useState(new Set());
  const wallRef = useRef(null);
  const poseSnapshot = useRef(null);

  // Load and process wall image
  useEffect(() => {
    const img = new Image();
    img.src = Wall1;
    img.onload = () => {
      wallRef.current = img;
      processWallImage(img);
      startPhaseTimer();
    };
  }, []);

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
    setWhitePixels(pixels);
  };

  const startPhaseTimer = () => {
    const startTime = Date.now();
    const targetDuration = phase === 'preview' 
      ? GAME_CONFIG.PREVIEW_DURATION
      : GAME_CONFIG.MATCHING_DURATION;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTimeLeft(targetDuration - elapsed);

      if (elapsed >= targetDuration) {
        clearInterval(timer);
        if (phase === 'preview') {
          setPhase('matching');
          setTimeLeft(GAME_CONFIG.MATCHING_DURATION);
          startPhaseTimer();
        } else {
          evaluatePose();
        }
      }
    }, 100);
  };

  const evaluatePose = () => {
    if (!poseSnapshot.current || !wallRef.current) {
      onFail();
      return;
    }

    const canvasWidth = wallRef.current.width;
    const canvasHeight = wallRef.current.height;
    let matchedPoints = 0;

    poseSnapshot.current.forEach(landmark => {
      const x = Math.floor(landmark.x * canvasWidth);
      const y = Math.floor(landmark.y * canvasHeight);
      if (whitePixels.has(`${x},${y}`)) matchedPoints++;
    });

    const matchPercent = matchedPoints / poseSnapshot.current.length;
    matchPercent >= GAME_CONFIG.MATCH_THRESHOLD ? onSuccess() : onFail();
  };

  // Capture pose snapshot when matching phase ends
  useEffect(() => {
    if (phase === 'matching') {
      poseSnapshot.current = poseLandmarks;
    }
  }, [phase, poseLandmarks]);

  return (
    <div className="absolute inset-0 z-30">
      {/* Preview Phase - Wall Display */}
      {phase === 'preview' && wallRef.current && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={Wall1} 
            className="max-w-full max-h-full object-contain border-4 border-white/30 rounded-xl"
            alt="Wall pattern"
            style={{
              boxShadow: '0 0 40px rgba(255,255,255,0.2)',
              transform: 'scaleX(-1)' // Match video mirroring
            }}
          />
        </div>
      )}
      
      {/* Phase Timer */}
      <div className="absolute top-4 left-4 text-white text-4xl font-bold z-40">
        {Math.ceil(timeLeft / 1000)}
      </div>
    </div>
  );
};

export default GamePhaseManager; 