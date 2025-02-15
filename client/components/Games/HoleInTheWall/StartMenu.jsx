import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const StartMenu = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-blue-100"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-8 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl font-bold text-purple-800"
        >
          Hole in the Wall
        </motion.h1>
        <p className="text-xl text-gray-600">
          Match your pose to the shape in the wall!
        </p>
        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="w-48 h-12 text-lg bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={onStart}
            >
              Start Game
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StartMenu; 