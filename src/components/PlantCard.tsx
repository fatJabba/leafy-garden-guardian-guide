
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Droplet, Sun, ThermometerSun } from "lucide-react";
import { Link } from "react-router-dom";

interface PlantCardProps {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  lastWatered?: string;
  wateringFrequency: "low" | "medium" | "high";
  sunlight: "low" | "partial" | "full";
  temperature: "cool" | "average" | "warm";
  composted?: boolean; // Added the composted prop
}

const PlantCard = ({
  id,
  name,
  species,
  imageUrl,
  lastWatered,
  wateringFrequency,
  sunlight,
  temperature,
  composted = false, // Default value for composted
}: PlantCardProps) => {
  
  const getWateringColor = () => {
    switch(wateringFrequency) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-blue-200 text-blue-800";
      case "high": return "bg-blue-300 text-blue-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };
  
  const getSunlightColor = () => {
    switch(sunlight) {
      case "low": return "bg-yellow-100 text-yellow-800";
      case "partial": return "bg-yellow-200 text-yellow-800";
      case "full": return "bg-yellow-300 text-yellow-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  const getTemperatureColor = () => {
    switch(temperature) {
      case "cool": return "bg-green-100 text-green-800";
      case "average": return "bg-green-200 text-green-800";
      case "warm": return "bg-green-300 text-green-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${composted ? 'opacity-70' : ''}`}>
      <Link to={`/plant/${id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="p-4 pb-2">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{species}</p>
            {composted && (
              <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                Composted
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-2">
          <div className="flex flex-wrap gap-2 mt-2">
            <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 ${getWateringColor()}`}>
              <Droplet className="h-3 w-3" />
              <span className="capitalize">{wateringFrequency}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 ${getSunlightColor()}`}>
              <Sun className="h-3 w-3" />
              <span className="capitalize">{sunlight}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 ${getTemperatureColor()}`}>
              <ThermometerSun className="h-3 w-3" />
              <span className="capitalize">{temperature}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2">
          {lastWatered ? (
            <p className="text-xs text-muted-foreground">
              Last watered: {lastWatered}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Not watered yet</p>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PlantCard;
