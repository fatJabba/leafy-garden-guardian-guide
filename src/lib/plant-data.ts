
export type WateringFrequency = "low" | "medium" | "high";
export type Sunlight = "low" | "partial" | "full";
export type Temperature = "cool" | "average" | "warm";

export interface Plant {
  id: string;
  name: string;
  species: string;
  description: string;
  imageUrl: string;
  wateringFrequency: WateringFrequency;
  wateringInstructions: string;
  sunlight: Sunlight;
  temperature: Temperature;
  lastWatered?: string;
  dateAdded: string;
  careInstructions: string[];
}

// Sample plant data
export const plants: Plant[] = [
  {
    id: "plant-1",
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    description: "Also known as the Swiss Cheese Plant, this tropical plant is known for its distinctive leaf holes and is popular as a houseplant.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    wateringFrequency: "medium",
    wateringInstructions: "Water when the top 2-3 inches of soil is dry, approximately once a week.",
    sunlight: "partial",
    temperature: "average",
    lastWatered: "2025-05-10",
    dateAdded: "2025-04-01",
    careInstructions: [
      "Keep in bright, indirect light",
      "Water when the top 2-3 inches of soil feel dry",
      "Maintain temperature between 65-80°F",
      "Increase humidity with a humidifier or pebble tray",
      "Wipe leaves occasionally to remove dust"
    ]
  },
  {
    id: "plant-2",
    name: "Snake Plant",
    species: "Sansevieria trifasciata",
    description: "A hardy succulent with tall, stiff leaves that can grow in a variety of conditions.",
    imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    wateringFrequency: "low",
    wateringInstructions: "Allow soil to dry completely between waterings, approximately every 2-3 weeks.",
    sunlight: "low",
    temperature: "average",
    lastWatered: "2025-05-05",
    dateAdded: "2025-03-15",
    careInstructions: [
      "Tolerates low light but grows best in medium to bright indirect light",
      "Let soil dry completely between waterings",
      "Avoid overwatering which can cause root rot",
      "Thrives in normal indoor temperatures (65-80°F)",
      "Dust leaves occasionally with a damp cloth"
    ]
  },
  {
    id: "plant-3",
    name: "Fiddle Leaf Fig",
    species: "Ficus lyrata",
    description: "Popular indoor tree with large, violin-shaped leaves that can grow up to 10 feet tall.",
    imageUrl: "https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    wateringFrequency: "medium",
    wateringInstructions: "Water when the top inch of soil is dry, usually once a week.",
    sunlight: "full",
    temperature: "warm",
    lastWatered: "2025-05-12",
    dateAdded: "2025-02-20",
    careInstructions: [
      "Place in bright, indirect sunlight",
      "Water thoroughly but allow top inch of soil to dry out between waterings",
      "Maintain consistent temperatures between 65-75°F",
      "Avoid drafts and sudden temperature changes",
      "Rotate occasionally for even growth",
      "Clean leaves with a damp cloth to keep them dust-free"
    ]
  }
];

// Get a single plant by ID
export const getPlantById = (id: string): Plant | undefined => {
  return plants.find((plant) => plant.id === id);
};
