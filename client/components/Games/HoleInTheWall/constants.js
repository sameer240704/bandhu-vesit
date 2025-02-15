import { Wall1 } from "@/public/images";

export const GAME_CONFIG = {
  PREVIEW_DURATION: 3000, // 3 seconds
  MATCHING_DURATION: 3000, // 3 seconds
  SUCCESS_THRESHOLD: 0.9, // 70% of joints must match
  SAFE_COLOR_THRESHOLD: 230, // RGB value for white detection
  SCORE_PER_WALL: 100,
  BODY_JOINTS: [ // List of relevant body joints
    "leftWrist", "rightWrist", "leftElbow", "rightElbow",
    "leftShoulder", "rightShoulder", "leftAnkle", "rightAnkle",
    "leftKnee", "rightKnee", "leftHip", "rightHip"
  ],
  WALL_DURATION: 5000, // 5 seconds per wall
  WALL_FADE_IN: 1000, // 1 second fade-in
};

// Pre-calculated outline polygon for Wall1 (example)
export const WALL1_OUTLINE = [
  { x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 },
  { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }
];

export const WALLS = [
  {
    id: 1,
    image: Wall1,
    outline: WALL1_OUTLINE,
    difficulty: 'easy'
  },
  {
    id: 2,
    image: Wall1,
    outline: WALL1_OUTLINE,
    difficulty: 'easy'
  },
  {
    id: 3,
    image: Wall1,
    outline: WALL1_OUTLINE,
    difficulty: 'easy'
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