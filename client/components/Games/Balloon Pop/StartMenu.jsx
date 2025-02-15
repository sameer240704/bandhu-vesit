import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hand } from "lucide-react";

const StartMenu = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-purple-600">Balloon Pop</h1>
        <p className="text-gray-600">Use your hand to pop the balloons!</p>
        {highScore > 0 && (
          <p className="text-sm text-purple-600 font-semibold">
            High Score: {highScore}
          </p>
        )}
        <Button onClick={onStart} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default StartMenu; 