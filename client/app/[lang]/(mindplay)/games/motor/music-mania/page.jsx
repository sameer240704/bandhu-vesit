import React from "react";

const MusicManiaPage = () => {
  return (
    <div className="h-full w-full border border-black rounded-lg overflow-hidden">
      <iframe
        src="https://mindplay-webxr.vercel.app/"
        width="100%"
        height="100%"
        allow="fullscreen; vr"
      ></iframe>
    </div>
  );
};

export default MusicManiaPage;
