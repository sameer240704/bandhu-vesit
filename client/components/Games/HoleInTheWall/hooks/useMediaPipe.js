import { useState, useEffect, useCallback } from 'react';

export const useMediaPipe = (videoRef) => {
  const [pose, setPose] = useState(null);
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
      // Wait for window.Pose to be available with timeout
      const waitForPose = async (timeout = 5000) => {
        const startTime = Date.now();
        while (!window.Pose) {
          if (Date.now() - startTime > timeout) {
            throw new Error('Timeout waiting for MediaPipe Pose to load');
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };

      await waitForPose();
      console.log('MediaPipe Pose found:', !!window.Pose);

      const poseInstance = new window.Pose({
        locateFile: (file) => {
          console.log('Loading MediaPipe file:', file);
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`;
        }
      });

      await poseInstance.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      poseInstance.onResults((results) => {
        console.log('MediaPipe Results:', results);
        if (results.segmentationMask) {
          setSegmentationMask(results);
        }
      });

      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await poseInstance.send({image: videoRef.current});
          }
        },
        width: 1280,
        height: 720
      });

      setPose(poseInstance);
      setCamera(camera);

      await camera.start();
      return poseInstance;
    } catch (error) {
      console.error('Detailed pose initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const stopMediaPipe = useCallback(() => {
    if (pose && typeof pose.close === 'function') {
      pose.close();
    }
    if (camera && typeof camera.stop === 'function') {
      camera.stop();
    }
  }, [pose, camera]);

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