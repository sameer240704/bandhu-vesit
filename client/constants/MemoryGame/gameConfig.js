export const getLevelConfig = (level) => {
  const configs = {
    1: { pairs: 6, grid: { cols: 6, rows: 2 }, attempts: 12 },
    2: { pairs: 8, grid: { cols: 4, rows: 4 }, attempts: 15 },
    3: { pairs: 10, grid: { cols: 5, rows: 4 }, attempts: 18 },
    4: { pairs: 12, grid: { cols: 8, rows: 3 }, attempts: 20 },
    5: { pairs: 15, grid: { cols: 10, rows: 3 }, attempts: 25 },
    6: { pairs: 18, grid: { cols: 9, rows: 4 }, attempts: 30 },
    7: { pairs: 21, grid: { cols: 7, rows: 6 }, attempts: 35 },
    8: { pairs: 24, grid: { cols: 8, rows: 6 }, attempts: 40 },
    9: { pairs: 28, grid: { cols: 8, rows: 7 }, attempts: 45 },
    10: { pairs: 30, grid: { cols: 10, rows: 6 }, attempts: 50 },
  };
  return configs[level] || configs[1];
};
