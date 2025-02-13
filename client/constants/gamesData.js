import { colorGame, FlappyBird, MusicMania, numberMatch } from "@/public/images";

export const motorGames = [
  {
    title: "Music Mania",
    publisher: "MindPlay",
    rating: "4.8",
    players: "1828",
    views: "210",
    imageUrl: MusicMania,
    isHot: true,
    gameLink: "/music-mania",
  },
  {
    title: "Flappy Bird",
    publisher: "MindPlay",
    rating: "4.1",
    players: "644",
    views: "1232",
    imageUrl: FlappyBird,
    isHot: false,
    gameLink: "/flappy-bird",
  }
];

export const emotionalGames = [
  {
    title: "Color And Paint",
    publisher: "MindPlay",
    rating: "4.8",
    players: "1828",
    views: "250",
    imageUrl: colorGame,
    isHot: true,
    gameLink: "/color-paint",
  },
];

export const cognitiveGames = [
  {
    title: "Number Match - Memory Game",
    publisher: "MindPlay",
    rating: "4.8",
    players: "1828",
    views: "352",
    imageUrl: numberMatch,
    isHot: true,
    gameLink: "/number-match",
  },
];

export const socialGames = []