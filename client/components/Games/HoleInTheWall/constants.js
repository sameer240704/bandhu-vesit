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
  }
};

export const WALLS = [
  {
    id: 1,
    image: '/cutouts/wall1.jpg',
    difficulty: 'easy'
  },
  // Add more walls here as needed
]; 