
import NavBar from "@/components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would save the plant to the database
    toast({
      title: "Plant added successfully!",
      description: "Your new plant has been added to your garden.",
    });
    navigate("/");
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
                Enter the details of your new plant companion.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Plant Name</Label>
                <Input id="name" placeholder="e.g., Green Friend, Kitchen Fern" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="species">Species (if known)</Label>
                <Input id="species" placeholder="e.g., Monstera deliciosa" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your plant..." required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Plant Image</Label>
                <div className="flex items-center gap-4">
                  <div className="border border-input rounded-lg p-2">
                    <Label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 gap-1 text-sm text-muted-foreground">
                      <Upload className="h-5 w-5" />
                      <span>Upload</span>
                    </Label>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="watering">Water Needs</Label>
                  <Select defaultValue="medium" required>
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
                  <Select defaultValue="partial" required>
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
                  <Select defaultValue="average" required>
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
                  <Select defaultValue="indoor" required>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-garden-500 hover:bg-garden-600">
                Add Plant
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddPlant;
