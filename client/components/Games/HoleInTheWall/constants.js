import { Wall1 } from "@/public/images";

export const GAME_CONFIG = {
  ANIMATION_DURATION: 3000, // milliseconds
  INITIAL_SCALE: 1.5,
  FINAL_SCALE: 1.0,
  INITIAL_OPACITY: 0,
  FINAL_OPACITY: 1,
  SCORE_TIERS: {
    PERFECT: 95,
    GREAT: 85,
    GOOD: 70
  },
  WALL_DURATION: 5000, // 5 seconds per wall
  WALL_FADE_IN: 1000, // 1 second fade-in
  SAFE_COLOR_THRESHOLD: 230, // RGB value for white detection
  SCORE_PER_WALL: 100,
  PREVIEW_DURATION: 3000, // 3 seconds
  MATCHING_DURATION: 3000, // 3 seconds
  MATCH_THRESHOLD: 0.8, // 80% match required
  WHITE_PIXEL_THRESHOLD: 245,
  SCORE_PER_LEVEL: 100,
};

export const WALLS = [
  {
    id: 1,
    image: Wall1,
    difficulty: 'easy'
  },
  {
    id: 2,
    image: './cutouts/wall1.png',
    difficulty: 'medium'
  },
  // Add more walls here as needed
];

export const POSE_CONNECTIONS = [
  [12,11], [24,12], [23,11], [24,23],
  [26,24], [25,23], [26,28], [25,27],
  [28,32], [27,31], [32,28], [31,27],
  [16,14], [14,12], [15,13], [13,11],
  [16,22], [15,21], [22,16], [21,15],
  [22,28], [21,27], [0,1], [1,2],
  [0,4], [4,5], [2,3], [3,7],
  [0,8], [4,6], [5,6], [11,23],
  [12,24]
]; 