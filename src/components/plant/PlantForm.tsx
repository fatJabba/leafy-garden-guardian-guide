
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
import CareInstructionsList from "./CareInstructionsList";

export interface PlantFormData {
  name: string;
  species: string;
  description: string;
  watering: "low" | "medium" | "high";
  sunlight: "low" | "partial" | "full";
  temperature: "cool" | "average" | "warm";
  location: "indoor" | "outdoor";
}

interface PlantFormProps {
  imagePreview: string | null;
  formData: PlantFormData;
  careInstructions: string[];
  handleInputChange: (field: string, value: string) => void;
}

const PlantForm = ({
  imagePreview,
  formData,
  careInstructions,
  handleInputChange
}: PlantFormProps) => {
  return (
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
      
      <CareInstructionsList instructions={careInstructions} />
      
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
  );
};

export default PlantForm;
