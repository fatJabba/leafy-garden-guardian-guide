
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPlantById } from "@/lib/plant-data";
import NavBar from "@/components/NavBar";
import { Droplet, Sun, ThermometerSun, Calendar, ArrowLeft, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const PlantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const plant = getPlantById(id || "");
  const [lastWatered, setLastWatered] = useState<string | undefined>(plant?.lastWatered);
  const { toast } = useToast();
  
  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Plant not found</h2>
            <Button asChild>
              <Link to="/">Go Back</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const handleWaterPlant = () => {
    const today = new Date().toISOString().split('T')[0];
    setLastWatered(today);
    toast({
      title: "Plant watered!",
      description: `You've watered ${plant.name} today.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to garden
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{plant.name}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                className="bg-garden-500 hover:bg-garden-600 gap-2"
                onClick={handleWaterPlant}
              >
                <Droplet className="h-4 w-4" />
                Water Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-3">Plant Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Species</p>
                    <p className="font-medium">{plant.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Added On</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-garden-500" />
                      <p>{plant.dateAdded}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Watered</p>
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-garden-500" />
                      <p>{lastWatered || "Not watered yet"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this plant</h2>
                <p className="mb-6">{plant.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <Droplet className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">Water</h3>
                    <p className="text-sm text-muted-foreground capitalize">{plant.wateringFrequency}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <Sun className="h-6 w-6 text-yellow-500 mb-2" />
                    <h3 className="font-medium">Light</h3>
                    <p className="text-sm text-muted-foreground capitalize">{plant.sunlight}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <ThermometerSun className="h-6 w-6 text-green-500 mb-2" />
                    <h3 className="font-medium">Temperature</h3>
                    <p className="text-sm text-muted-foreground capitalize">{plant.temperature}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Care Instructions</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-2">Watering</h3>
                    <p>{plant.wateringInstructions}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Plant Care Checklist</h3>
                    <ul className="space-y-2">
                      {plant.careInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-garden-500 mr-2">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetails;
