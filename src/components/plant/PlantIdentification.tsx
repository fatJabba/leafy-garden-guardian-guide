
import { useState } from "react";
import PlantCamera from "@/components/PlantCamera";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { identifyPlant } from "@/services/plantIdentificationService";

interface PlantIdentificationProps {
  onIdentification: (imageData: string, result: any, imagePath: string | null) => void;
}

const PlantIdentification = ({ onIdentification }: PlantIdentificationProps) => {
  const { toast } = useToast();
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleImageCapture = async (imageData: string, uploadedImagePath: string | null = null) => {
    setIsIdentifying(true);
    
    try {
      const result = await identifyPlant(imageData);
      
      onIdentification(imageData, result, uploadedImagePath);
      
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

  return (
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
  );
};

export default PlantIdentification;
