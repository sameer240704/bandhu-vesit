import React, { useEffect } from 'react';

const ScriptLoader = ({ onLoad }) => {
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Load only the essential scripts we need
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        onLoad();
      } catch (error) {
        console.error('Script loading error:', error);
      }
    };

    loadScripts();
  }, [onLoad]);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return null;
};

export default ScriptLoader; 