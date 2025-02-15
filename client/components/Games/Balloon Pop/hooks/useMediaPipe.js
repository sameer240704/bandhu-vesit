import { useState, useEffect, useCallback } from "react";

export const useMediaPipe = (videoRef) => {
  const [hands, setHands] = useState(null);
  const [handLandmarks, setHandLandmarks] = useState([]);
  const [camera, setCamera] = useState(null);
  const [stream, setStream] = useState(null);

  const initializeCamera = useCallback(async () => {
    try {
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      // Get user media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      // Save stream reference
      setStream(mediaStream);
      
      // Set video source
      videoRef.current.srcObject = mediaStream;
      await videoRef.current.play();

      return true;
    } catch (error) {
      console.error('Camera initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const initializeHandTracking = useCallback(async () => {
    try {
      // First, stop any existing instances
      if (hands) {
        hands.close();
        setHands(null);
      }
      if (camera) {
        camera.stop();
        setCamera(null);
      }

      // Wait for MediaPipe to be ready
      if (!window.Hands) {
        throw new Error('MediaPipe Hands not loaded');
      }

      // Create new hands instance
      const handsInstance = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      // Set up hands
      await handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handsInstance.onResults((results) => {
        if (results.multiHandLandmarks) {
          setHandLandmarks(results.multiHandLandmarks);
        } else {
          setHandLandmarks([]);
        }
      });

      // Ensure video is playing
      if (videoRef.current?.paused) {
        await videoRef.current.play();
      }

      // Create and start camera
      const cameraInstance = new window.Camera(videoRef.current, {
        onFrame: async () => {
          try {
            await handsInstance.send({image: videoRef.current});
          } catch (error) {
            console.error('Frame processing error:', error);
          }
        },
        width: 1280,
        height: 720
      });

      // Set state
      setHands(handsInstance);
      setCamera(cameraInstance);

      // Start camera last
      try {
        await cameraInstance.start();
        console.log('Camera started successfully');
        return true;
      } catch (error) {
        console.error('Camera start error:', error);
        throw error;
      }

    } catch (error) {
      console.error('Hand tracking initialization error:', error);
      throw error;
    }
  }, [videoRef]);

  const stopMediaPipe = useCallback(() => {
    try {
      if (camera) {
        camera.stop();
        setCamera(null);
      }
      if (hands) {
        hands.close();
        setHands(null);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setHandLandmarks([]);
    } catch (error) {
      console.error('Error stopping MediaPipe:', error);
    }
  }, [camera, hands, stream]);

  // Cleanup on unmount
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