import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { LEVEL_DATA } from "@/constants/ColoringGame/levelData";
import Iridescence from "@/components/ui/iridescence";

const LevelSelect = ({
  category,
  unlockedLevels,
  onLevelSelect,
  onBackToCategories,
}) => {
  const categoryData = LEVEL_DATA[category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-transparent p-8"
    >
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={0.75}
        className="absolute top-0 left-0 w-full h-full opacity-50 -z-10"
      />
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-8 w-24 justify-between"
      >
        <Button
          variant="outline"
          className="w-24 hover:bg-purple-500 hover:text-white"
          onClick={onBackToCategories}
        >
          Back
        </Button>
      </motion.div>

      <motion.h2
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-4xl font-bold text-center text-purple-800 mb-8"
      >
        {categoryData.title} Levels
      </motion.h2>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categoryData.levels.map((level, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              whileHover={
                unlockedLevels.includes(level.id) ? { scale: 1.05, y: -5 } : {}
              }
              whileTap={
                unlockedLevels.includes(level.id) ? { scale: 0.95 } : {}
              }
            >
              <Card
                className={`p-6 text-center ${
                  unlockedLevels.includes(level.id)
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  unlockedLevels.includes(level.id) && onLevelSelect(level)
                }
              >
                <div className="relative">
                  {!unlockedLevels.includes(level.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-4xl">🔒</span>
                    </motion.div>
                  )}
                  <Image
                    src={level.image}
                    alt={`Level ${level.id}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold">Level {level.id}</h3>
                  {unlockedLevels.includes(level.id) && (
                    <p className="text-sm text-gray-600 mt-2">
                      {level.description}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LevelSelect;
