
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Sun, Thermometer } from "lucide-react";
import { getPlantById, Plant } from "@/lib/plant-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import PlantDetailActions from "@/components/plant/PlantDetailActions";
import PlantChat from "@/components/plant/PlantChat";
import { toast } from "@/hooks/use-toast";

const PlantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPlant = getPlantById(id);
      if (foundPlant) {
        setPlant(foundPlant);
      } else {
        toast({
          title: "Plant not found",
          description: "The plant you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate("/");
      }
      setLoading(false);
    }
  }, [id, navigate]);

  const handleCompost = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex justify-center items-center h-full">
            <p>Loading plant details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex justify-center items-center h-full">
            <p>Plant not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to garden
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{plant.name}</h1>
              <p className="text-muted-foreground italic">{plant.species}</p>
            </div>
            
            {plant.composted ? (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Composted on {plant.dateComposted}
              </Badge>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <PlantDetailActions plant={plant} onCompost={handleCompost} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 order-2 md:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Plant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-xs text-muted-foreground">Water</span>
                    <span className="font-medium capitalize">{plant.wateringFrequency}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Sun className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="text-xs text-muted-foreground">Light</span>
                    <span className="font-medium capitalize">{plant.sunlight}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Thermometer className="h-5 w-5 text-red-500 mb-1" />
                    <span className="text-xs text-muted-foreground">Temp</span>
                    <span className="font-medium capitalize">{plant.temperature}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{plant.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Watering Instructions</h4>
                  <p className="text-sm text-muted-foreground">{plant.wateringInstructions}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Care Instructions</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {plant.careInstructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Added on: {plant.dateAdded}
                    {plant.lastWatered && ` • Last watered: ${plant.lastWatered}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 order-1 md:order-2">
            <Tabs defaultValue="image">
              <TabsList className="mb-4">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="chat">Ask AI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="mt-0">
                <Card>
                  <CardContent className="p-1">
                    <div className="aspect-video rounded-md overflow-hidden bg-muted">
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0">
                <PlantChat plant={plant} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetails;
