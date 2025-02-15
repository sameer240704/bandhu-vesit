"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Camera, User, ArrowDown } from "lucide-react";
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
      console.log(data);
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
    <div className="flex h-screen bg-gray-50">
      {/* Right Side Panel */}
      <div className="w-96 bg-white shadow-lg p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Story Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Character Name</label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <Input
              type="number"
              value={characterAge}
              onChange={(e) => setCharacterAge(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={startNewGame}
            disabled={!characterName || !characterAge}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Begin Adventure
          </Button>
        </div>

        {gameId && (
          <div className="mt-auto space-y-4">
            <h3 className="font-semibold">Current Game ID</h3>
            <div className="p-2 bg-gray-100 rounded text-sm">{gameId}</div>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {gameId ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {story.map((chapter, index) => (
              <div key={index} className="relative">
                <Card className="w-full">
                  <CardContent className="p-6">
                    {storyHistory[0]?.scenes[index]?.image && (
                      <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                        <img
                          src={`data:image/jpeg;base64,${storyHistory[0].scenes[index].image}`}
                          alt={`Scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    <p className="text-lg mb-4">{chapter}</p>

                    {index === story.length - 1 && options.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <h4 className="font-semibold text-sm text-gray-600">
                          Choose your next action:
                        </h4>
                        <div className="grid gap-2">
                          {options.map((option, optIndex) => (
                            <Button
                              key={optIndex}
                              onClick={() => chooseOption(optIndex)}
                              variant="outline"
                              className="w-full text-left justify-start h-auto py-3 hover:bg-blue-50"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {index < story.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowDown className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-medium">Begin Your Adventure</h2>
              <p className="mt-2">
                Enter your character details to start the journey
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-6 right-6 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSagaPage;
``;
