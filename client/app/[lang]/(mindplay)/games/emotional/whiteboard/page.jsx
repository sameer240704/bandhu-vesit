"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Edit,
  Plus,
  LogIn,
  Square,
  Circle,
  Triangle,
  Highlighter,
  Pen,
  Type,
  X,
  Eraser,
} from "lucide-react";

const WhiteboardGame = () => {
  const [currentView, setCurrentView] = useState("start");
  const [gameMode, setGameMode] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [currentShape, setCurrentShape] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textBoxes, setTextBoxes] = useState([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const tools = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    { id: "text", icon: Type, label: "Text" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const shapes = [
    { id: "square", icon: Square, label: "Square" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
  ];

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  // Create room function
  const createRoom = () => {
    // Generate random room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setCurrentView("whiteboard");
  };

  // Join room function
  const joinRoom = () => {
    setCurrentView("whiteboard");
  };

  // Drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "text") {
      setIsAddingText(true);
      setTextPosition({ x, y });
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });

    const context = contextRef.current;
    context.beginPath();
    context.moveTo(x, y);

    if (currentTool === "highlighter") {
      context.globalAlpha = 0.3;
    } else {
      context.globalAlpha = 1.0;
    }

    context.strokeStyle = currentTool === "eraser" ? "#ffffff" : currentColor;
    context.lineWidth =
      currentTool === "highlighter" ? brushSize * 2 : brushSize;
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = contextRef.current;

    if (currentShape) {
      // Clear the canvas and redraw background
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawDottedBackground();
      drawTextboxes();

      context.beginPath();
      if (currentShape === "square") {
        const width = x - startPos.x;
        const height = y - startPos.y;
        context.rect(startPos.x, startPos.y, width, height);
      } else if (currentShape === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        );
        context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      } else if (currentShape === "triangle") {
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(x, y);
        context.lineTo(startPos.x - (x - startPos.x), y);
        context.closePath();
      }
      context.stroke();
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
    }
  };

  const drawDottedBackground = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#e5e7eb";
    const spacing = 20;
    const dotSize = 2;

    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        context.beginPath();
        context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const drawTextboxes = () => {
    const context = contextRef.current;
    textBoxes.forEach((textBox) => {
      context.font = `${brushSize * 5}px Arial`;
      context.fillStyle = textBox.color;
      context.fillText(textBox.text, textBox.x, textBox.y);
    });
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setTextBoxes([
        ...textBoxes,
        {
          text: textInput,
          x: textPosition.x,
          y: textPosition.y,
          color: currentColor,
        },
      ]);
      setTextInput("");
      setIsAddingText(false);

      // Redraw canvas with new text
      const context = contextRef.current;
      context.font = `${brushSize * 5}px Arial`;
      context.fillStyle = currentColor;
      context.fillText(textInput, textPosition.x, textPosition.y);
    }
  };

  // Create dotted background pattern
  useEffect(() => {
    if (currentView === "whiteboard") {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      contextRef.current = context;

      drawDottedBackground();
      drawTextboxes();
    }
  }, [currentView, textBoxes]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const toolbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.3 },
    },
  };

  // Rest of the component remains the same...
  // (Start Menu View, Room Selection View, and Whiteboard View JSX)

  if (currentView === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="w-96">
            <CardContent className="space-y-4 p-6">
              <motion.h1
                className="text-3xl font-bold text-center mb-8"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Whiteboard Game
              </motion.h1>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-12 text-lg"
                    onClick={() => {
                      setGameMode("single");
                      setCurrentView("whiteboard");
                    }}
                  >
                    Single Player
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-12 text-lg"
                    onClick={() => {
                      setGameMode("multi");
                      setCurrentView("roomSelect");
                    }}
                  >
                    Multi Player
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (currentView === "roomSelect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="w-96">
            <CardContent className="space-y-4 p-6">
              <motion.h2
                className="text-2xl font-bold text-center mb-6"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                Join Game
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-4"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={createRoom}
                    disabled={!username}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </Button>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Enter room code"
                      value={roomCode}
                      onChange={(e) =>
                        setRoomCode(e.target.value.toUpperCase())
                      }
                    />
                    <Button
                      onClick={joinRoom}
                      disabled={!username || !roomCode}
                      className="w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Join Room
                    </Button>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="bg-white rounded-lg shadow-lg p-4">
          <motion.div
            className="flex justify-between items-center mb-4"
            variants={toolbarVariants}
            initial="hidden"
            animate="visible"
          >
            {gameMode === "multi" && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  Room: {roomCode} ({activeUsers.length} users)
                </span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <motion.div className="flex gap-2 border-r pr-4" layout>
                {tools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentTool(tool.id)}
                      title={tool.label}
                    >
                      <tool.icon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="flex gap-2 border-r pr-4" layout>
                {shapes.map((shape) => (
                  <motion.div
                    key={shape.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={
                        currentShape === shape.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentShape(shape.id)}
                      title={shape.label}
                    >
                      <shape.icon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="flex gap-2 border-r pr-4" layout>
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-6 h-6 rounded-full ${
                      currentColor === color
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </motion.div>

              <Input
                type="number"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                min="1"
                max="20"
                className="w-20"
              />
            </div>
          </motion.div>

          <div className="relative w-full h-[700px] border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />

            {isAddingText && (
              <div
                className="absolute"
                style={{ left: textPosition.x, top: textPosition.y }}
              >
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text"
                    className="w-48"
                    autoFocus
                  />
                  <Button onClick={handleTextSubmit}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingText(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default WhiteboardGame;
