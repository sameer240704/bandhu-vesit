import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Download } from "lucide-react";
import Iridescence from "@/components/ui/iridescence";

const GamePage = ({ level, category, onBackToLevels }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [score, setScore] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#A52A2A", // Brown
    "#FFC0CB", // Pink
    "#808080", // Gray
    "#000080", // Navy
    "#D2691E", // Chocolate
    "#87CEEB", // Sky Blue
  ];

  const countUncoloredParts = () => {
    return 5;
  };

  const getColoringData = () => {
    return {
      levelId: level.id,
      category: category,
      coloredAreas: [],
      totalParts: 20,
      uncoloredParts: countUncoloredParts(),
    };
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const coloringData = getColoringData();

      const response = await fetch("/api/submit-coloring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coloringData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit coloring");
      }

      const data = await response.json();
      setScore(data.score);
      setDownloadUrl(data.imageUrl);
    } catch (err) {
      setError("Failed to submit. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `colored-image-${category}-level-${level.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-transparent p-3"
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
        className="w-32"
      >
        <Button
          variant="outline"
          className="hover:bg-purple-500 hover:text-white"
          onClick={onBackToLevels}
        >
          Back to Levels
        </Button>
      </motion.div>

      <div className="max-w-4xl mx-auto flex flex-col justify-center gap-8 h-3/4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <Image
            src={level.image}
            width={600}
            height={400}
            alt="Coloring Canvas"
            className="w-full object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex justify-center gap-4">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.8 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                // transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Button
                  className="w-12 h-12 rounded-full p-0"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {loading ? "Submitting..." : "Submit Coloring"}
              </Button>
            </motion.div>

            {downloadUrl && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </motion.div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {score !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white rounded-lg shadow-md mt-4"
            >
              <h3 className="font-semibold text-purple-800">Results:</h3>
              <p>Your Score: {score}</p>
              <p>Remaining Parts to Color: {countUncoloredParts()}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GamePage;
