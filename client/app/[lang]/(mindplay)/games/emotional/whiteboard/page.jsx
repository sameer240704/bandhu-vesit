"use client";

import React, { useState, useRef, useEffect } from "react";
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
  // View states
  const [currentView, setCurrentView] = useState("start"); // start, roomSelect, whiteboard
  const [gameMode, setGameMode] = useState(null); // single, multi

  // Room states
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [currentShape, setCurrentShape] = useState(null);

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

  useEffect(() => {
    if (currentView === "whiteboard") {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;
      contextRef.current = context;
    }
  }, [currentView]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (currentTool === "pen" || currentTool === "highlighter") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (currentTool === "eraser") {
      const ctx = contextRef.current;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, brushSize * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const createRoom = () => {
    if (username) {
      setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase());
      setActiveUsers([username]);
      setCurrentView("whiteboard");
    }
  };

  const joinRoom = () => {
    if (username && roomCode) {
      setActiveUsers((prev) => [...prev, username]);
      setCurrentView("whiteboard");
    }
  };

  // Start Menu View
  if (currentView === "start") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Whiteboard Game
          </h1>
          <div className="space-y-4">
            <Button
              className="w-full h-12 text-lg"
              onClick={() => {
                setGameMode("single");
                setCurrentView("whiteboard");
              }}
            >
              Single Player
            </Button>
            <Button
              className="w-full h-12 text-lg"
              onClick={() => {
                setGameMode("multi");
                setCurrentView("roomSelect");
              }}
            >
              Multi Player
            </Button>
            <Button
              className="w-full h-12 text-lg"
              variant="destructive"
              onClick={() => window.close()}
            >
              Exit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Room Selection View
  if (currentView === "roomSelect") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Join Game</h2>
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
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
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
        </CardContent>
      </Card>
    );
  }

  // Whiteboard View
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          {gameMode === "multi" && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                Room: {roomCode} ({activeUsers.length} users)
              </span>
            </div>
          )}
          <div className="flex items-center gap-4">
            {/* Tools */}
            <div className="flex gap-2 border-r pr-4">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={currentTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentTool(tool.id)}
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Shapes */}
            <div className="flex gap-2 border-r pr-4">
              {shapes.map((shape) => (
                <Button
                  key={shape.id}
                  variant={currentShape === shape.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentShape(shape.id)}
                  title={shape.label}
                >
                  <shape.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex gap-2 border-r pr-4">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${
                    currentColor === color
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>

            {/* Brush Size */}
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value="2">Fine</option>
              <option value="4">Medium</option>
              <option value="8">Bold</option>
              <option value="12">Extra Bold</option>
            </select>

            {/* Exit Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCurrentView("start")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-[600px] border rounded bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default WhiteboardGame;
