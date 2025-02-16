"use client";

import React from "react";

const WhiteboardGame = () => {
  return (
    <div className="h-screen bg-gray-50 shadow-xl flex items-center justify-center">
      <iframe
        src="https://nextdraw.vercel.app/"
        title="NextDraw Whiteboard"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default WhiteboardGame;
