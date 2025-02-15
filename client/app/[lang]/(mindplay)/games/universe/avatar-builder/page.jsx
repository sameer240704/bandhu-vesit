"use client";

import { Logo } from "@/public/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const AvatarBuilderPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full border border-black rounded-lg overflow-hidden relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-1000 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="transform transition-transform duration-1000 scale-100 hover:scale-110">
            <Image
              src={Logo}
              alt="Logo"
              className={`h-20 w-auto ${
                fadeOut ? "scale-110 opacity-0" : "scale-100 opacity-100"
              } transition-all duration-1000`}
            />
          </div>
        </div>
      )}
      <div
        className={`h-full w-full transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <iframe
          src="https://avatar.wawasensei.dev/"
          width="100%"
          height="100%"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default AvatarBuilderPage;
