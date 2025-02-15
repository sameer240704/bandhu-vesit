import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Save,
  Eraser,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import Iridescence from "@/components/ui/iridescence";
import { TEMPLATE_MAPPING } from "@/constants/ColoringGame/levelData";
import { useUser } from "@clerk/nextjs";

const GamePage = ({
  level,
  category,
  onBackToLevels,
  onLevelComplete,
  onShowGallery,
}) => {
  if (!level) {
    return (
      <div className="text-center text-red-500">
        <p>Error: Level data is missing.</p>
      </div>
    );
  }

  const { user } = useUser();
  const userId = user?.id; // Access user id from Clerk

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedElements, setSelectedElements] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const templateRef = useRef(null);

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#A52A2A",
    "#FFC0CB",
    "#808080",
    "#000080",
    "#D2691E",
    "#87CEEB",
  ];

  const TemplateImage = level?.image;

  const handleElementClick = (elementId) => {
    if (!selectedColor) return;
    setSelectedElements((prev) => ({
      ...prev,
      [elementId]: selectedColor,
    }));
    console.log("Element clicked: ", elementId);
  };

  const calculateProgress = () => {
    const coloredElements = Object.keys(selectedElements).length;
    const totalRequired = level?.requiredElements?.length || 1;
    return (coloredElements / totalRequired) * 100;
  };

  const handleSubmitToDatabase = async () => {
    if (!userId) {
      setError("You must be logged in to save to the database.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract color data from selectedElements
      const colorsUsed = Object.entries(selectedElements).map(
        ([elementId, hex_code]) => {
          return {
            name: elementId, // You might want to have a mapping for elementId to color name
            hex_code: hex_code,
          };
        }
      );

      //Prepare data to be sent
      const coloringData = {
        userId: userId,
        completed_levels: level.id,
        image: level.id,
        colors_used: colorsUsed,
      };

      const response = await fetch("/api/coloring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coloringData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save to database: ${response.status} - ${response.statusText}`
        );
      }

      // Handle successful save
      console.log("Successfully saved to database!");
    } catch (err) {
      setError(`Failed to save to database: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!templateRef.current) return;

    const svg = templateRef.current.cloneNode(true);

    for (const elementId in selectedElements) {
      const color = selectedElements[elementId];
      const element = svg.querySelector(`#${elementId}`);
      if (element) {
        element.setAttribute("fill", color);
      }
    }

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `coloring_page_${level.id}_${category}.svg`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(svgUrl);
  };

  const handleSave = () => {
    if (!templateRef.current) return;

    const svg = templateRef.current.cloneNode(true);
    for (const elementId in selectedElements) {
      const color = selectedElements[elementId];
      const element = svg.querySelector(`#${elementId}`);
      if (element) {
        element.setAttribute("fill", color);
      }
    }

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

    try {
      const saveData = {
        selectedElements: selectedElements,
        imageDataUrl: svgDataUrl,
      };
      localStorage.setItem(
        `coloringGame-${level.id}-${category}`,
        JSON.stringify(saveData)
      );
      setSaved(true);
      console.log("Game saved successfully!");
    } catch (error) {
      console.error("Error saving game:", error);
      setSaved(false);
    } finally {
      setSaved(true);
    }
  };

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(
        `coloringGame-${level.id}-${category}`
      );
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSelectedElements(parsedData.selectedElements || {});
        setSaved(true);
      }
    } catch (error) {
      console.error("Error loading saved game:", error);
      setSaved(false);
    }
  }, [level, category]);

  useEffect(() => {
    if (templateRef.current) {
      const svg = templateRef.current;
      for (const elementId in selectedElements) {
        const color = selectedElements[elementId];
        const element = svg.querySelector(`#${elementId}`);

        if (element) {
          element.setAttribute("fill", color);
        }
      }
    }
  }, [selectedElements]);

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
        className="z-10 mb-8 w-24"
      >
        <Button
          variant="outline"
          className="hover:bg-purple-500 hover:text-white"
          onClick={onBackToLevels}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
      </motion.div>

      <div className="max-w-4xl my-10 mx-auto flex flex-col justify-center gap-8 h-3/4">
        {TemplateImage ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white m-10 rounded-lg shadow-lg p-8 mb-8"
          >
            {/* Attach the ref to the TemplateImage component */}
            <TemplateImage
              onClick={handleElementClick}
              selectedElements={selectedElements}
              className=" w-full h-full"
              ref={templateRef}
            />
          </motion.div>
        ) : (
          <p className="text-center text-red-500">Template not found.</p>
        )}

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
                onClick={handleSubmitToDatabase}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {loading ? "Submitting..." : "Submit Coloring"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => templateRef.current && setSelectedColor(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                <Eraser className="mr-2" />
                Remove Color
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="mr-2" />
                Save
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="mr-2" />
                Download
              </Button>
            </motion.div>

            {/* Gallery Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onShowGallery}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ImageIcon className="mr-2" />
                Gallery
              </Button>
            </motion.div>

            {/* Submit to Database Button */}
          </div>

          {saved && (
            <Alert className="mt-4" variant="success">
              <AlertDescription>Successfully saved!</AlertDescription>
            </Alert>
          )}
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GamePage;
