// Define 20 paths from bottom to top
export const BALLOON_PATHS = [
  // Straight paths
  { startX: 200, endX: 200, speed: 4 },    // Straight up from left
  { startX: 400, endX: 400, speed: 3 },    // Straight up from center-left
  { startX: 600, endX: 600, speed: 4 },    // Straight up from center
  { startX: 800, endX: 800, speed: 8 },    // Straight up from center-right
  { startX: 1000, endX: 1000, speed: 2 },  // Straight up from right
  
  // Diagonal paths left to right
  { startX: 200, endX: 400, speed: 3 },
  { startX: 400, endX: 600, speed: 3 },
  { startX: 600, endX: 800, speed: 2 },
  { startX: 200, endX: 800, speed: 8 },
  { startX: 400, endX: 1000, speed: 5 },
  
  // Diagonal paths right to left
  { startX: 1000, endX: 800, speed: 3 },
  { startX: 800, endX: 600, speed: 3 },
  { startX: 600, endX: 400, speed: 2 },
  { startX: 1000, endX: 400, speed: 8 },
  { startX: 800, endX: 200, speed: 5 },
  
  // S-curved paths
  { startX: 400, endX: 600, speed: 2, curve: true },
  { startX: 600, endX: 400, speed: 2, curve: true },
  { startX: 200, endX: 600, speed: 8, curve: true },
  { startX: 800, endX: 400, speed: 5, curve: true },
  { startX: 600, endX: 1000, speed: 3, curve: true }
];

// Pastel colors with transparency
export const BALLOON_COLORS = [
  'rgba(255, 182, 193, 0.7)',    // Light pink
  'rgba(173, 216, 230, 0.7)',    // Light blue
  'rgba(144, 238, 144, 0.7)',    // Light green
  'rgba(255, 218, 185, 0.7)',    // Peach
  'rgba(221, 160, 221, 0.7)',    // Plum
  'rgba(176, 224, 230, 0.7)',    // Powder blue
  'rgba(255, 255, 224, 0.7)'     // Light yellow
]; 