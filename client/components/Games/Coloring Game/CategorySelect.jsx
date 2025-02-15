// CategorySelect.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { TEMPLATE_DATA } from "@/constants/ColoringGame/levelData";
import Iridescence from "@/components/ui/iridescence";
import { CheckCircle2 } from "lucide-react";

const CategorySelect = ({
  onCategorySelect,
  onBackToStart,
  completedLevels,
}) => {
  const getCategoryProgress = (category) => {
    const totalLevels = TEMPLATE_DATA[category].levels.length;
    const completedCount = TEMPLATE_DATA[category].levels.filter((level) =>
      completedLevels?.includes(`${category}-${level.id}`)
    ).length;
    return Math.round((completedCount / totalLevels) * 100);
  };
  const [categoryTemplates, setCategoryTemplates] = useState({});

  useEffect(() => {
    const templateMap = {};

    Object.entries(TEMPLATE_DATA).forEach(([category, data]) => {
      // Store the first image of each category.  You could also randomize this.
      templateMap[category] = data.levels[0].image;
    });

    setCategoryTemplates(templateMap);
  }, []);

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
        className="z-10 mb-8 w-24"
      >
        <Button
          variant="outline"
          className="hover:bg-purple-500 hover:text-white"
          onClick={onBackToStart}
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
        Select Category
      </motion.h2>

      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {Object.entries(TEMPLATE_DATA).map(([category, data], index) => {
          const progress = getCategoryProgress(category);
          const TemplateComponent = categoryTemplates[category]; // Access the correct template for this category

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="p-6 text-center cursor-pointer relative overflow-hidden"
                  onClick={() => onCategorySelect(category)}
                >
                  {progress === 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 text-green-500"
                    >
                      <CheckCircle2 size={24} />
                    </motion.div>
                  )}

                  <div className="relative h-48 mb-4">
                    <div className="w-full h-full rounded-md overflow-hidden">
                      {TemplateComponent ? (
                        <TemplateComponent className="w-full h-full" />
                      ) : (
                        <div>Loading Template...</div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {data.description}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {`${progress}% Complete`}
                  </p>

                  {/* Level count */}
                  <p className="text-sm text-gray-600 mt-2">
                    {`${data.levels.length} Levels Available`}
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategorySelect;
