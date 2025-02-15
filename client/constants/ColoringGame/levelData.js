import { TEMPLATE_MAPPING } from "@/components/Games/Coloring Game/PaintGame";

// constants/ColoringGame/templateData.js
export const TEMPLATE_DATA = {
  vehicles: {
    title: "Vehicles",
    description: "Color different types of vehicles",
    levels: [
      {
        id: 1,
        templateType: "car",
        description: "Simple car outline",
        difficulty: "Easy",
        minScore: 80,
        expectedTime: 300,
        image: TEMPLATE_MAPPING.car,
        requiredElements: ["car-body", "car-roof", "wheels", "windows"],
      },
      // Add more vehicle levels...
    ],
  },
  buildings: {
    title: "Buildings",
    description: "Color various buildings and structures",
    levels: [
      {
        id: 1,
        templateType: "house",
        description: "Simple house outline",
        difficulty: "Easy",
        minScore: 80,
        expectedTime: 300,
        image: TEMPLATE_MAPPING.house,
        requiredElements: ["house-body", "roof", "door", "windows"],
      },
      // Add more building levels...
    ],
  },
  nature: {
    title: "Nature",
    description: "Color natural elements and scenes",
    levels: [
      {
        id: 1,
        templateType: "flower",
        description: "Simple flower outline",
        difficulty: "Easy",
        minScore: 80,
        expectedTime: 300,
        image: TEMPLATE_MAPPING.flower,
        requiredElements: ["stem", "petals", "leaves", "center"],
      },
      // Add more nature levels...
    ],
  },
};
