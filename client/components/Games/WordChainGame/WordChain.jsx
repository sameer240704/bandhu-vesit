"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertCircle, 
  Check, 
  Timer, 
  Trophy,
  Cat,
  Globe2,
  Apple,
  Crown,
  Star,
  Clock,
  Sparkles,
  XCircle,
  Brain,
  Zap,
  Shield
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const themeIcons = {
  animals: Cat,
  countries: Globe2,
  fruits: Apple
};

const difficultyIcons = {
  easy: Shield,
  medium: Brain,
  hard: Zap
};

// Comprehensive lists of valid words for each category
const categoryValidation = {
  animals: [
    'dog', 'cat', 'rat', 'pig', 'cow', 'bat', 'hen', 'ant', 'bee', 'tiger', 'rabbit', 
    'panda', 'eagle', 'snake', 'horse', 'sheep', 'goat', 'elephant', 'penguin', 
    'giraffe', 'octopus', 'kangaroo', 'cheetah', 'dolphin', 'lion', 'zebra', 'rhino',
    'bear', 'wolf', 'fox', 'deer', 'moose', 'camel', 'llama', 'koala', 'monkey'
  ],
  countries: [
    'usa', 'peru', 'cuba', 'chad', 'iran', 'mali', 'fiji', 'laos', 'japan', 'india',
    'spain', 'kenya', 'chile', 'turkey', 'mexico', 'belgium', 'thailand', 'zimbabwe',
    'australia', 'argentina', 'singapore', 'china', 'russia', 'brazil', 'canada',
    'france', 'germany', 'italy', 'egypt', 'nigeria', 'vietnam', 'nepal', 'iraq',

    'afghanistan', 'albania', 'algeria', 'andorra', 'angola', 'antigua and barbuda',
    'armenia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados',
    'belarus', 'belize', 'benin', 'bhutan', 'bolivia', 'bosnia and herzegovina', 'botswana',
    'brunei', 'bulgaria', 'burkina faso', 'burundi', 'cabo verde', 'cambodia', 'cameroon',
    'central african republic', 'comoros', 'congo (brazzaville)', 'congo (kinshasa)',
    'costa rica', 'croatia', 'cyprus', 'czech republic', 'denmark', 'djibouti', 'dominica',
    'dominican republic', 'ecuador', 'el salvador', 'equatorial guinea', 'eritrea', 'estonia',
    'eswatini', 'ethiopia', 'gabon', 'gambia', 'georgia', 'ghana', 'greece', 'grenada',
    'guatemala', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'honduras', 'hungary',
    'iceland', 'indonesia', 'ireland', 'israel', 'jamaica', 'jordan', 'kazakhstan', 'kiribati',
    'north korea', 'south korea', 'kosovo', 'kuwait', 'kyrgyzstan', 'latvia', 'lebanon',
    'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'madagascar',
    'malawi', 'malaysia', 'maldives', 'malta', 'marshall islands', 'mauritania', 'mauritius',
    'micronesia', 'moldova', 'monaco', 'mongolia', 'montenegro', 'morocco', 'mozambique',
    'myanmar', 'namibia', 'nauru', 'netherlands', 'new zealand', 'nicaragua', 'niger',
    'north macedonia', 'norway', 'oman', 'pakistan', 'palau', 'panama', 'papua new guinea',
    'paraguay', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'rwanda',
    'saint kitts and nevis', 'saint lucia', 'saint vincent and the grenadines', 'samoa',
    'san marino', 'sao tome and principe', 'saudi arabia', 'senegal', 'serbia', 'seychelles',
    'sierra leone', 'slovakia', 'slovenia', 'solomon islands', 'somalia', 'south africa',
    'south sudan', 'sri lanka', 'sudan', 'suriname', 'sweden', 'switzerland', 'syria',
    'taiwan', 'tajikistan', 'tanzania', 'timor-leste', 'togo', 'tonga', 'trinidad and tobago',
    'tunisia', 'turkmenistan', 'tuvalu', 'uganda', 'ukraine', 'united arab emirates',
    'united kingdom', 'uruguay', 'uzbekistan', 'vanuatu', 'vatican city', 'venezuela',
    'yemen', 'zambia'
],
  fruits: [
    'fig', 'pear', 'lime', 'plum', 'date', 'kiwi', 'apple', 'mango', 'grape', 'peach',
    'lemon', 'orange', 'banana', 'dragonfruit', 'pineapple', 'pomegranate', 'blackberry',
    'raspberry', 'strawberry', 'blueberry', 'watermelon', 'papaya', 'guava', 'coconut',
    'apricot', 'cherry', 'cranberry', 'grapefruit', 'tangerine', 'nectarine'
  ]
};

const WordChainGame = () => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [baseTimeLimit, setBaseTimeLimit] = useState(15);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [recentPerformances, setRecentPerformances] = useState([]);
  const [lastWordStartTime, setLastWordStartTime] = useState(Date.now());

  const validateCategory = (word, theme) => {
    // Check if the word is in the category's list
    return categoryValidation[theme].includes(word.toLowerCase());
  };

  const analyzeMovePerformance = (
    wordLength, 
    timeUsed, 
    isSuccess,
    isValidCategory
  ) => {
    return {
      wordLength,
      timeUsed,
      isSuccess,
      isValidCategory
    };
  };

  const adjustDifficulty = (performances) => {
    if (performances.length < 3) return { difficulty: 'medium', timeAdjustment: 0 };

    const recentPerfs = performances.slice(-3);
    const avgWordLength = recentPerfs.reduce((sum, p) => sum + p.wordLength, 0) / 3;
    const avgTimeUsed = recentPerfs.reduce((sum, p) => sum + p.timeUsed, 0) / 3;
    const successRate = recentPerfs.filter(p => p.isSuccess && p.isValidCategory).length / 3;

    let performanceScore = 0;
    let timeAdjustment = 0;
    
    // Word length contribution
    if (avgWordLength > 7) performanceScore += 2;
    else if (avgWordLength > 5) performanceScore += 1;

    // Time usage contribution
    if (avgTimeUsed < 5) performanceScore += 2;
    else if (avgTimeUsed < 8) performanceScore += 1;

    // Success rate contribution
    if (successRate === 1) performanceScore += 2;
    else if (successRate >= 0.66) performanceScore += 1;

    // Calculate time adjustment based on performance
    if (successRate < 0.33) timeAdjustment = 5; // Add 5 seconds if struggling
    else if (successRate === 1 && avgTimeUsed < 5) timeAdjustment = -3; // Reduce time if performing very well

    // Determine difficulty based on performance score
    const difficulty = performanceScore >= 4 ? 'hard' : 
                      performanceScore >= 2 ? 'medium' : 
                      'easy';

    return { difficulty, timeAdjustment };
  };

  const getRandomStartingWord = (theme) => {
    const words = categoryValidation[theme];
    return words[Math.floor(Math.random() * words.length)];
  };

  const startGame = (theme) => {
    const initialWord = getRandomStartingWord(theme);
    setSelectedTheme(theme);
    setCurrentWord(initialWord);
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setBaseTimeLimit(15);
    setInput('');
    setMessage({ type: '', text: '' });
    setUsedWords(new Set([initialWord]));
    setCurrentDifficulty('medium');
    setRecentPerformances([]);
    setLastWordStartTime(Date.now());
  };

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setMessage({ type: 'error', text: 'Time\'s up! Game Over!' });
      setGameStarted(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted]);

  const handleSubmit = () => {
    const lastChar = currentWord.slice(-1);
    const userWord = input.toLowerCase().trim();
    const timeUsed = (Date.now() - lastWordStartTime) / 1000;

    if (userWord.length < 2) {
      setMessage({ type: 'error', text: 'Word must be at least 2 letters long!' });
      return;
    }

    if (usedWords.has(userWord)) {
      setMessage({ type: 'error', text: 'Word already used! Try another one.' });
      return;
    }

    const isValidForCategory = validateCategory(userWord, selectedTheme);

    if (!isValidForCategory) {
      setMessage({ 
        type: 'error', 
        text: `Invalid ${selectedTheme}! Please enter a valid ${selectedTheme.slice(0, -1)}!`
      });
      return;
    }

    if (userWord.startsWith(lastChar)) {
      // Record successful performance
      const performance = analyzeMovePerformance(
        userWord.length, 
        timeUsed, 
        true,
        isValidForCategory
      );
      const newPerformances = [...recentPerformances, performance];
      setRecentPerformances(newPerformances);

      // Adjust difficulty and time limit every 3 moves
      if (newPerformances.length % 3 === 0) {
        const { difficulty, timeAdjustment } = adjustDifficulty(newPerformances);
        setCurrentDifficulty(difficulty);
        
        // Adjust base time limit but keep it between 8 and 20 seconds
        const newBaseTime = Math.min(Math.max(baseTimeLimit + timeAdjustment, 8), 20);
        setBaseTimeLimit(newBaseTime);
      }

      setUsedWords(prev => new Set([...prev, userWord]));
      setScore(score + userWord.length);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      setCurrentWord(userWord);
      setInput('');
      setTimeLeft(baseTimeLimit);
      setMessage({ 
        type: 'success', 
        text: `+${userWord.length} points! ${
          newPerformances.length % 3 === 0 ? 
          `Difficulty: ${currentDifficulty}, Time limit: ${baseTimeLimit}s! ` : 
          ''
        }Keep going!`
      });
      setAnimation(true);
      setLastWordStartTime(Date.now());
    } else {
      // Record failed performance
      const performance = analyzeMovePerformance(0, timeUsed, false, isValidForCategory);
      setRecentPerformances([...recentPerformances, performance]);
      setMessage({ type: 'error', text: `Word must start with '${lastChar}'!` });
    }
  };

  useEffect(() => {
    if (animation) {
      setTimeout(() => setAnimation(false), 500);
    }
  }, [animation]);

  const DifficultyIcon = difficultyIcons[currentDifficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-green-700 p-8">
      <Card className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 border-2 border-white/20 shadow-xl">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text flex items-center justify-center gap-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            Endless Word Chain
            <Crown className="h-8 w-8 text-yellow-400" />
          </h1>
          
          {!gameStarted ? (
            <div className="space-y-4">
              <h2 className="text-2xl text-center text-white mb-6 flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-400" />
                Choose a Theme
                <Star className="h-6 w-6 text-yellow-400" />
              </h2>
              {bestStreak > 0 && (
                <div className="text-center text-white mb-4 flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Best Streak: {bestStreak}
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(themeIcons).map((theme) => {
                  const ThemeIcon = themeIcons[theme];
                  return (
                    <Button
                      key={theme}
                      onClick={() => startGame(theme)}
                      className="h-24 text-lg capitalize bg-gradient-to-br from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 border-2 border-white/20 shadow-lg transform hover:scale-105 transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <ThemeIcon className="h-8 w-8" />
                      {theme}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between text-white mb-4">
                <div className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Score: {score}
                </div>
                <div className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Streak: {streak}
                </div>
                <div className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  {timeLeft}s
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-white">
                  <DifficultyIcon className="h-5 w-5 text-yellow-400" />
                  Level: {currentDifficulty}
                  <Timer className="h-5 w-5 text-yellow-400" />
                  Time Limit: {baseTimeLimit}s
                </div>
                <div
                  className={`text-4xl font-bold text-white p-6 rounded-lg bg-gradient-to-r from-purple-500/50 to-green-500/50 border-2 border-white/20 shadow-lg transform transition-all ${
                    animation ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {currentWord}
                </div>
              </div>

              <div className="flex space-x-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder={`Enter a ${selectedTheme?.slice(0, -1)} starting with '${currentWord.slice(-1)}'`}
                  className="flex-1 bg-white/20 border-2 border-white/20 text-white placeholder-white/70"
                />
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 border-2 border-white/20"
                >
                  Submit
                </Button>
              </div>

              {message.text && (
                <Alert className={`${
                  message.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                } border-2 border-white/20`}>
                  {message.type === 'success' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription className="text-white">
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between text-white text-center">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Words used: {usedWords.size}
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-yellow-400" />
                  Category: {selectedTheme}
                </div>
              </div>

              <Button
                onClick={() => setGameStarted(false)}
                variant="outline"
                className="w-full mt-4 border-2 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                End Game
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordChainGame;