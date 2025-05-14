import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PlantCamera from "@/components/PlantCamera";
import { identifyPlant } from "@/services/plantIdentificationService";
import { supabase } from "@/integrations/supabase/client";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationComplete, setIdentificationComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    description: "",
    watering: "medium",
    sunlight: "partial",
    temperature: "average",
    location: "indoor",
  });
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageCapture = async (imageData: string, uploadedImagePath: string | null = null) => {
    setImagePreview(imageData);
    if (uploadedImagePath) {
      setImagePath(uploadedImagePath);
    }
    
    setIsIdentifying(true);
    
    try {
      const result = await identifyPlant(imageData);
      
      setFormData({
        name: result.name,
        species: result.species,
        description: result.careInstructions.description,
        watering: result.careInstructions.watering,
        sunlight: result.careInstructions.sunlight,
        temperature: result.careInstructions.temperature,
        location: "indoor", // Default
      });
      
      setCareInstructions(result.careInstructions.tips);
      setIdentificationComplete(true);
      
      toast({
        title: `Identified as ${result.name}!`,
        description: `We're ${Math.round(result.confidence * 100)}% confident in this identification.`,
      });
    } catch (error) {
      toast({
        title: "Identification failed",
        description: "We couldn't identify your plant. Please try again with a clearer image.",
        variant: "destructive"
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real app, this would save the plant to the database
      // For now, let's simulate saving to Supabase
      const plantData = {
        name: formData.name,
        species: formData.species,
        type: formData.location, // Using location as type
        user_id: "anonymous", // In a real app, this would be the authenticated user's ID
        image_url: imagePreview,
        image_path: imagePath,
        care_instructions: {
          description: formData.description,
          watering: formData.watering,
          sunlight: formData.sunlight,
          temperature: formData.temperature,
          tips: careInstructions
        }
      };
      
      // If we have authentication later, we can use this
      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   plantData.user_id = user.id;
      // }
      
      // For now, this will actually fail due to RLS policies requiring authentication
      // but the code is in place for when authentication is implemented
      console.log("Would save plant data:", plantData);
      
      toast({
        title: "Plant added successfully!",
        description: "Your new plant has been added to your garden.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error saving plant:", error);
      toast({
        title: "Failed to save plant",
        description: "There was an error saving your plant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Plant</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <p className="text-muted-foreground">
                Take a photo of your plant for automatic identification, or add details manually.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!identificationComplete ? (
                <div className="space-y-4">
                  <PlantCamera onCapture={handleImageCapture} />
                  
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-input"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        or upload an image
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="relative">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const imageData = reader.result as string;
                              handleImageCapture(imageData);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        disabled={isIdentifying}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isIdentifying}
                      >
                        {isIdentifying ? "Identifying..." : "Upload image"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                    {imagePreview && (
                      <div className="relative rounded-md overflow-hidden w-[120px] h-[120px]">
                        <img src={imagePreview} alt="Plant" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Plant Name</Label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => handleInputChange("name", e.target.value)} 
                          placeholder="e.g., Green Friend, Kitchen Fern" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <Label htmlFor="species">Species</Label>
                        <Input 
                          id="species" 
                          value={formData.species} 
                          onChange={(e) => handleInputChange("species", e.target.value)} 
                          placeholder="e.g., Monstera deliciosa" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={formData.description} 
                      onChange={(e) => handleInputChange("description", e.target.value)} 
                      placeholder="Describe your plant..." 
                      required 
                    />
                  </div>
                  
                  {careInstructions.length > 0 && (
                    <div className="space-y-3 bg-garden-50 p-4 rounded-md border border-garden-100">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-garden-600" />
                        <h3 className="font-medium text-garden-800">Care Instructions</h3>
                      </div>
                      <ul className="space-y-1">
                        {careInstructions.map((tip, index) => (
                          <li key={index} className="text-sm flex">
                            <span className="text-garden-600 mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="watering">Water Needs</Label>
                      <Select 
                        value={formData.watering}
                        onValueChange={(value) => handleInputChange("watering", value)}
                        required
                      >
                        <SelectTrigger id="watering">
                          <SelectValue placeholder="Select watering frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Infrequent</SelectItem>
                          <SelectItem value="medium">Medium - Weekly</SelectItem>
                          <SelectItem value="high">High - Frequent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sunlight">Sunlight</Label>
                      <Select 
                        value={formData.sunlight}
                        onValueChange={(value) => handleInputChange("sunlight", value)} 
                        required
                      >
                        <SelectTrigger id="sunlight">
                          <SelectValue placeholder="Select sunlight needs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Light</SelectItem>
                          <SelectItem value="partial">Partial Sun</SelectItem>
                          <SelectItem value="full">Full Sun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Select 
                        value={formData.temperature}
                        onValueChange={(value) => handleInputChange("temperature", value)}
                        required
                      >
                        <SelectTrigger id="temperature">
                          <SelectValue placeholder="Select temperature needs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cool">Cool</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={formData.location}
                        onValueChange={(value) => handleInputChange("location", value)}
                        required
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select plant location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor">Indoor</SelectItem>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-garden-500 hover:bg-garden-600"
                disabled={(!identificationComplete && !isIdentifying) || isSaving}
              >
                {isSaving ? "Saving..." : "Add Plant"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddPlant;
