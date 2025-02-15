import { useState, useEffect, useCallback } from "react";

export const useMediaPipe = (videoRef) => {
  const [hands, setHands] = useState(null);
  const [handLandmarks, setHandLandmarks] = useState([]);
  const [camera, setCamera] = useState(null);

  const initializeCamera = useCallback(async () => {
    try {
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      return true;
    } catch (error) {
      console.error('Camera initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const initializeHandTracking = useCallback(async () => {
    try {
      // Initialize hands
      const hands = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1.1606863095/${file}`;
        }
      });

      // Configure hands
      hands.setOptions({
        selfieMode: true,
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.9
      });

      // Set up hand detection callback
      hands.onResults((results) => {
        if (results.multiHandLandmarks) {
          setHandLandmarks(results.multiHandLandmarks);
        } else {
          setHandLandmarks([]);
        }
      });

      // Initialize camera after hands is ready
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720
      });

      // Start camera
      await camera.start();

      // Save instances
      setHands(hands);
      setCamera(camera);

      return hands;
    } catch (error) {
      console.error('Hand tracking initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const stopMediaPipe = useCallback(() => {
    if (camera) {
      camera.stop();
      setCamera(null);
    }
    if (hands) {
      hands.close();
      setHands(null);
      setHandLandmarks([]);
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  }, [hands, camera, videoRef]);

  useEffect(() => {
    return () => {
      stopMediaPipe();
    };
  }, [stopMediaPipe]);

  return {
    handLandmarks,
    initializeCamera,
    initializeHandTracking,
    stopMediaPipe,
  };
}; 