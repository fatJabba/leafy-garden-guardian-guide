
import React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPromptProps {
  onStart: () => void;
  isAttemptingToStart: boolean;
}

const CameraPrompt: React.FC<CameraPromptProps> = ({ onStart, isAttemptingToStart }) => {
  // Use a simple click handler that doesn't involve cross-origin communication
  const handleStartCamera = () => {
    console.log("Requesting camera access...");
    onStart();
  };
  
  return (
    <>
      <Camera className="w-12 h-12 text-gray-400 mb-4" />
      <Button 
        type="button" 
        onClick={handleStartCamera}
        className="bg-garden-500 hover:bg-garden-600"
        disabled={isAttemptingToStart}
      >
        {isAttemptingToStart ? "Starting Camera..." : "Open Camera"}
      </Button>
    </>
  );
};

export default CameraPrompt;
