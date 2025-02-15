import { useState, useEffect, useCallback } from 'react';

export const useMediaPipe = (videoRef) => {
  const [holistic, setHolistic] = useState(null);
  const [segmentationMask, setSegmentationMask] = useState(null);
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

  const initializeHolistic = useCallback(async () => {
    try {
      const holistic = new window.Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`;
        }
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      holistic.onResults((results) => {
        if (results.segmentationMask) {
          setSegmentationMask(results.segmentationMask);
        }
      });

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720
      });

      await camera.start();

      setHolistic(holistic);
      setCamera(camera);

      return holistic;
    } catch (error) {
      console.error('Holistic initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const stopMediaPipe = useCallback(() => {
    if (camera) {
      camera.stop();
      setCamera(null);
    }
    if (holistic) {
      holistic.close();
      setHolistic(null);
      setSegmentationMask(null);
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  }, [holistic, camera, videoRef]);

  useEffect(() => {
    return () => {
      stopMediaPipe();
    };
  }, [stopMediaPipe]);

  return {
    segmentationMask,
    initializeCamera,
    initializeHolistic,
    stopMediaPipe,
  };
}; 