"use client";
import React from "react";
import BalloonGame from "@/components/Games/Balloon Pop/BalloonGame";
import Script from "next/script";

const BalloonPopPage = () => {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1.1606863095/hands.js"
        strategy="beforeInteractive"
      />
      <BalloonGame />
    </>
  );
};

export default BalloonPopPage; 