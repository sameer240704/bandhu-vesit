import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { LEVEL_DATA } from "@/constants/ColoringGame/levelData";
import Iridescence from "@/components/ui/iridescence";

const CategorySelect = ({ onCategorySelect, onBackToStart }) => {
  return (
    <>
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
            className="flex w-24 hover:bg-purple-500 hover:text-white"
            onClick={onBackToStart}
          >
            Back
          </Button>
        </motion.div>

        <motion.h2
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="z-10 text-4xl font-bold text-center text-purple-800 mb-8"
        >
          Select Category
        </motion.h2>

        <div className=" grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {Object.entries(LEVEL_DATA).map(([category, data], index) => (
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
                  className="p-6 text-center cursor-pointer"
                  onClick={() => onCategorySelect(category)}
                >
                  <Image
                    src={data.levels[0].image}
                    alt={data.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold">{data.title}</h3>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default CategorySelect;
