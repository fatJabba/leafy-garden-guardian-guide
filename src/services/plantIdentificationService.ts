
// This is a mock plant identification service
// In a real application, you would integrate with an actual plant identification API

interface PlantIdentificationResult {
  name: string;
  species: string;
  confidence: number;
  careInstructions: {
    watering: string;
    sunlight: string;
    temperature: string;
    description: string;
    tips: string[];
  };
}

const MOCK_PLANTS: PlantIdentificationResult[] = [
  {
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    confidence: 0.92,
    careInstructions: {
      watering: "medium",
      sunlight: "partial",
      temperature: "warm",
      description: "The Monstera Deliciosa, also known as the Swiss Cheese Plant, is known for its large, glossy, perforated leaves.",
      tips: [
        "Water when the top 1-2 inches of soil are dry",
        "Prefers bright, indirect light",
        "Keep in temperatures between 65-85°F",
        "Enjoys high humidity but adapts to average home conditions",
        "Feed with a balanced fertilizer monthly during growing season"
      ]
    }
  },
  {
    name: "Peace Lily",
    species: "Spathiphyllum wallisii",
    confidence: 0.89,
    careInstructions: {
      watering: "medium",
      sunlight: "low",
      temperature: "average",
      description: "Peace Lilies are elegant plants with glossy dark green leaves and beautiful white spathes.",
      tips: [
        "Keep soil consistently moist but not soggy",
        "Thrives in low to moderate light conditions",
        "Prefers temperatures between 65-80°F",
        "Drooping leaves indicate it needs water",
        "Mist regularly to increase humidity"
      ]
    }
  },
  {
    name: "Snake Plant",
    species: "Sansevieria trifasciata",
    confidence: 0.95,
    careInstructions: {
      watering: "low",
      sunlight: "partial",
      temperature: "average",
      description: "Snake Plants have tall, stiff, upright leaves with distinctive patterns, making them one of the most adaptable houseplants.",
      tips: [
        "Allow soil to dry completely between waterings",
        "Tolerates low light but grows best in indirect bright light",
        "Thrives in normal room temperatures between 60-85°F",
        "Very drought tolerant - perfect for beginners",
        "Rarely needs repotting and prefers to be slightly root-bound"
      ]
    }
  },
  {
    name: "Pothos",
    species: "Epipremnum aureum",
    confidence: 0.93,
    careInstructions: {
      watering: "low",
      sunlight: "partial",
      temperature: "average",
      description: "Pothos is a popular trailing plant with heart-shaped leaves, known for its air-purifying abilities and easy care.",
      tips: [
        "Allow soil to dry out between waterings",
        "Adaptable to various light conditions from low to bright indirect light",
        "Thrives in normal room temperatures between 65-85°F",
        "Highly tolerant of neglect - perfect for beginners",
        "Prune occasionally to promote bushier growth"
      ]
    }
  },
  {
    name: "Aloe Vera",
    species: "Aloe barbadensis miller",
    confidence: 0.91,
    careInstructions: {
      watering: "low",
      sunlight: "full",
      temperature: "warm",
      description: "Aloe Vera is a succulent plant known for its healing properties and distinctive fleshy, serrated leaves.",
      tips: [
        "Water deeply but infrequently, allowing soil to dry completely between waterings",
        "Needs bright, direct sunlight to thrive",
        "Prefers warm temperatures between 70-85°F",
        "Use well-draining soil, such as a cactus mix",
        "Watch for brown, thin leaves which indicate overwatering"
      ]
    }
  }
];

// This function simulates an identification attempt
// It returns either a successful identification or asks for another image
export async function identifyPlant(imageData: string): Promise<PlantIdentificationResult> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // 15% chance to ask for another image
      const needBetterImage = Math.random() < 0.15;
      
      if (needBetterImage) {
        reject(new Error("Could not identify plant clearly. Please take another photo in better lighting."));
        return;
      }
      
      // Randomly select a plant from our mock data
      const randomIndex = Math.floor(Math.random() * MOCK_PLANTS.length);
      const identifiedPlant = MOCK_PLANTS[randomIndex];
      
      // Add slight randomness to the confidence score
      const confidenceVariation = (Math.random() * 0.1) - 0.05;
      identifiedPlant.confidence = Math.min(0.99, Math.max(0.7, identifiedPlant.confidence + confidenceVariation));
      
      console.log("Plant identified:", identifiedPlant.name, "with confidence:", identifiedPlant.confidence);
      resolve(identifiedPlant);
    }, 1500);
  });
}
