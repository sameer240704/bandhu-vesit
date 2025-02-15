"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Camera, User } from "lucide-react";
import { AI_SERVER_URL } from "@/constants/utils";

const ScenarioSagaPage = () => {
  const [characterName, setCharacterName] = useState("");
  const [characterAge, setCharacterAge] = useState("");
  const [gameId, setGameId] = useState("");
  const [scenario, setScenario] = useState("");
  const [image, setImage] = useState("");
  const [options, setOptions] = useState([]);
  const [story, setStory] = useState([]);
  const [error, setError] = useState("");
  const [storyHistory, setStoryHistory] = useState([]);

  const fetchStorySoFar = async () => {
    setError("");
    try {
      const response = await fetch(
        `${AI_SERVER_URL}/story_so_far?game_id=${encodeURIComponent(gameId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch story");
      }

      const data = await response.json();
      setStory(data);

      setStoryHistory((prevHistory) => {
        const existingStoryIndex = prevHistory.findIndex(
          (s) => s.id === gameId
        );
        if (existingStoryIndex >= 0) {
          const updatedHistory = [...prevHistory];
          updatedHistory[existingStoryIndex] = {
            ...updatedHistory[existingStoryIndex],
            scenes: data.map((scenario, index) => ({
              scenario,
              timestamp: new Date().toISOString(),
              sequence: index,
            })),
          };
          return updatedHistory;
        }
        return prevHistory;
      });
    } catch (err) {
      setError(`Error fetching story: ${err.message}`);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchStorySoFar();
    }
  }, [gameId]);

  const startNewGame = async () => {
    setError("");
    try {
      const response = await fetch(`${AI_SERVER_URL}/start_game/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: characterName,
          age: parseInt(characterAge),
        }),
      });

      if (!response.ok) throw new Error("Failed to start game");

      const data = await response.json();
      const newGameId = characterName + characterAge;
      setGameId(newGameId);
      setScenario(data.scenario);
      setImage(data.image);
      setOptions(data.options);
      setStory([data.scenario]);

      setStoryHistory([
        ...storyHistory,
        {
          id: newGameId,
          timestamp: new Date().toISOString(),
          scenes: [
            {
              scenario: data.scenario,
              image: data.image,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const chooseOption = async (optionIndex) => {
    setError("");
    try {
      const formData = new URLSearchParams();
      formData.append("chosen_option", optionIndex);
      formData.append("game_id", gameId);

      const response = await fetch(`${AI_SERVER_URL}/choose_option/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to choose option");

      const data = await response.json();
      setScenario(data.scenario);
      setImage(data.image);
      setOptions(data.options);
      setStory([...story, data.scenario]);

      setStoryHistory((prevHistory) =>
        prevHistory.map((story) => {
          if (story.id === gameId) {
            return {
              ...story,
              scenes: [
                ...story.scenes,
                {
                  scenario: data.scenario,
                  image: data.image,
                  chosenOption: optionIndex,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return story;
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container p-4 overflow-y-scroll">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Interactive Story Adventure
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!gameId ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Character Name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Age"
                  value={characterAge}
                  onChange={(e) => setCharacterAge(e.target.value)}
                  className="w-24"
                />
              </div>
              <Button
                onClick={startNewGame}
                disabled={!characterName || !characterAge}
                className="w-full"
              >
                Begin Your Journey
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {image && (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt="Scene"
                    className="w-full h-full object-cover"
                  />
                  <Camera className="absolute top-2 right-2 w-6 h-6 text-white drop-shadow-lg" />
                </div>
              )}

              <div className="prose">
                <p className="text-lg">{scenario}</p>
              </div>

              {options.length > 0 && (
                <div className="space-y-2 w-full">
                  <h3 className="font-semibold">Choose Your Path:</h3>
                  <div className="grid gap-2">
                    {options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => chooseOption(index)} // Pass the index!
                        variant="outline"
                        className="w-full text-left justify-start h-auto py-3"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h3 className="font-semibold">Story So Far:</h3>
                <div className="space-y-2">
                  {story.map((chapter, index) => (
                    <p key={index} className="text-gray-600">
                      {index + 1}. {chapter}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioSagaPage;
``;
