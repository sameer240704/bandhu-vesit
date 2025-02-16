import React, { useEffect, useRef } from 'react';
import { POSE_CONNECTIONS } from './constants';

const PoseOverlay = ({ landmarks, videoWidth, videoHeight }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks || !videoWidth || !videoHeight) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Proper alignment with video feed
    ctx.save();
    ctx.scale(-1, 1); // Mirror horizontally
    ctx.translate(-canvas.width, 0);
    
    // Adjust for any offset
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;
    ctx.scale(scaleX, scaleY);
    
    // Draw with pastel colors and transparency
    if (window.drawConnectors) {
      window.drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
        color: 'rgba(150, 200, 255, 0.7)', // Pastel blue
        lineWidth: 3
      });
    }
    
    if (window.drawLandmarks) {
      window.drawLandmarks(ctx, landmarks, {
        color: 'rgba(255, 180, 200, 0.5)', // Pastel pink
        radius: 4,
        lineWidth: 1
      });
    }
    
    ctx.restore();
  }, [landmarks, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 35 }}
    />
  );
};

export default PoseOverlay; 