
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RefreshCw } from "lucide-react";
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
  onRestore?: () => void;
}

const PlantDetailActions = ({ plant, onCompost, onRestore }: PlantDetailActionsProps) => {
  const navigate = useNavigate();
  const [isComposting, setIsComposting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

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

  const handleRestore = () => {
    setIsRestoring(true);
    
    // Simulate a small delay for the operation
    setTimeout(() => {
      try {
        // In a real implementation, we would call restorePlant(plant.id)
        // For now, we'll just toggle the composted flag
        plant.composted = false;
        plant.dateComposted = undefined;
        
        toast({
          title: `${plant.name} restored from compost`,
          description: "The plant has been restored to your active collection.",
        });
        
        if (onRestore) {
          onRestore();
        } else {
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error restoring your plant.",
          variant: "destructive",
        });
      } finally {
        setIsRestoring(false);
      }
    }, 500);
  };

  if (plant.composted) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Restore Plant
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this plant?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move {plant.name} back to your active collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={isRestoring}
              className="bg-garden-500 text-white hover:bg-garden-600"
            >
              {isRestoring ? "Processing..." : "Yes, Restore Plant"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

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
