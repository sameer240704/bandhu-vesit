import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Iridescence from "@/components/ui/iridescence";

const StartMenu = ({ onStartClick, onExitClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 "
    >
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={0.75}
        className="absolute top-0 left-0 w-full h-full opacity-50"
      />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="z-10 pace-y-8 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl font-bold mb-4"
        >
          Coloring Game
        </motion.h1>
        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="w-48 h-12 hover:bg-violet-500 text-lg"
              onClick={onStartClick}
            >
              Start Game
            </Button>
          </motion.div>
          <br />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="w-48 h-12 text-lg"
              onClick={onExitClick}
            >
              Exit
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StartMenu;
