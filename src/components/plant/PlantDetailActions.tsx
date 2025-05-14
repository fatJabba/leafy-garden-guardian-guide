
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowLeftRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { compostPlant, Plant } from "@/lib/plant-data";

interface PlantDetailActionsProps {
  plant: Plant;
  onCompost?: () => void;
}

const PlantDetailActions = ({ plant, onCompost }: PlantDetailActionsProps) => {
  const navigate = useNavigate();
  const [isComposting, setIsComposting] = useState(false);

  const handleCompost = () => {
    setIsComposting(true);
    
    // Simulate a small delay for the operation
    setTimeout(() => {
      try {
        compostPlant(plant.id);
        
        toast({
          title: `${plant.name} moved to compost`,
          description: "The plant has been moved to your compost collection.",
        });
        
        if (onCompost) {
          onCompost();
        } else {
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error composting your plant.",
          variant: "destructive",
        });
      } finally {
        setIsComposting(false);
      }
    }, 500);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Compost Plant
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will move {plant.name} to your compost collection. You'll still be able to access its information for reference.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCompost}
            disabled={isComposting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isComposting ? "Processing..." : "Yes, Compost Plant"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlantDetailActions;
