"use client";
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import the game component to avoid SSR issues with browser APIs
const HoleInTheWallGame = dynamic(
  () => import('@/components/Games/HoleInTheWall/HoleInTheWallGame'),
  { ssr: false }
);

const HoleInTheWallPage = () => {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/holistic.js" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js" />
      <HoleInTheWallGame />
    </>
  );
};

export default HoleInTheWallPage; 