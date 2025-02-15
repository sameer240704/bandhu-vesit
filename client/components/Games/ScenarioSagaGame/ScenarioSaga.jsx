// app/page.js
'use client'

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ScenarioSaga() {
  const [story, setStory] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [characterName, setCharacterName] = useState('');
  const [characterAge, setCharacterAge] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateStartingScenario = async (age, name) => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with your actual API
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        body: JSON.stringify({ age, name }),
      });
      const data = await response.json();
      return data.scenario;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate starting scenario",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStory = async (e) => {
    e.preventDefault();
    if (!characterName || !characterAge) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const scenario = await generateStartingScenario(
      parseInt(characterAge),
      characterName
    );

    if (scenario) {
      setStory([scenario]);
      setIteration(1);
      setSetupComplete(true);
    }
  };

  const handleChooseOption = async (option) => {
    setStory([...story, option]);
    setIteration(iteration + 1);
  };

  const handleNewStory = () => {
    setStory([]);
    setIteration(0);
    setCharacterName('');
    setCharacterAge('');
    setSetupComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Scenario Saga
            </CardTitle>
            <p className="text-gray-600 mt-2">Create your own personalized story adventure!</p>
          </CardHeader>
          <CardContent className="p-6">
            {!setupComplete ? (
              <form onSubmit={handleStartStory} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Character Name
                    <Input
                      type="text"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="mt-1 block w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      maxLength={50}
                      placeholder="Enter character name..."
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Character Age
                    <Input
                      type="number"
                      value={characterAge}
                      onChange={(e) => setCharacterAge(e.target.value)}
                      className="mt-1 block w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      min={0}
                      max={120}
                      placeholder="Enter age..."
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Story...
                    </>
                  ) : (
                    'Start Story'
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {story.map((part, index) => (
                    <Card key={index} className="border border-purple-100 bg-white/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800">
                          Chapter {index + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{part}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {iteration < 5 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Replace with actual options from your API */}
                    {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                      <Card
                        key={index}
                        className="border border-purple-100 hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80"
                        onClick={() => handleChooseOption(option)}
                      >
                        <CardContent className="p-4">
                          <p className="font-medium text-purple-800 mb-2">
                            Option {index + 1}
                          </p>
                          <p className="text-gray-600 text-sm">{option}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-xl font-semibold text-purple-800">
                      🎉 Congratulations! Your story has reached its conclusion!
                    </p>
                    <Button
                      onClick={handleNewStory}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Start a New Story
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}