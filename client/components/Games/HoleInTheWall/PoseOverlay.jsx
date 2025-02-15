import React, { useEffect, useRef } from 'react';
import { POSE_CONNECTIONS } from './constants';

const PoseOverlay = ({ landmarks, visible, videoWidth, videoHeight }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible || !videoWidth || !videoHeight) return;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mirror the canvas
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);

      if (landmarks) {
        // Draw pose connections
        if (window.drawConnectors) {
          window.drawConnectors(
            ctx,
            landmarks,
            POSE_CONNECTIONS,
            { color: 'rgba(150, 200, 255, 0.7)', lineWidth: 5 } // Pastel blue, thicker
          );
        }

        // Draw landmarks
        if (window.drawLandmarks) {
          window.drawLandmarks(
            ctx,
            landmarks,
            { color: 'rgba(255, 180, 200, 0.7)', lineWidth: 2, radius: 5 } // Pastel pink, bigger
          );
        }

        // Display number of points
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Points: ${landmarks.length}`, 10, 20);
      }

      ctx.restore(); // Restore original state
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [landmarks, visible, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 40 }}
    />
  );
};

export default PoseOverlay; 