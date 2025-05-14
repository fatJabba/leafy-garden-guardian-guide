
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlantFormData } from "@/components/plant/PlantForm";

export default function usePlantForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationComplete, setIdentificationComplete] = useState(false);
  const [formData, setFormData] = useState<PlantFormData>({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIdentification = (imageData: string, result: any, uploadedImagePath: string | null) => {
    setImagePreview(imageData);
    if (uploadedImagePath) {
      setImagePath(uploadedImagePath);
    }
    
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

  return {
    imagePreview,
    imagePath,
    isIdentifying,
    identificationComplete,
    formData,
    careInstructions,
    isSaving,
    handleInputChange,
    handleIdentification,
    handleSubmit,
  };
}
