
import React, { useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPromptProps {
  onStart: () => void;
  isAttemptingToStart: boolean;
}

const CameraPrompt: React.FC<CameraPromptProps> = ({ onStart, isAttemptingToStart }) => {
  const handleStartClick = () => {
    console.log("Camera start button clicked - triggering onStart callback");
    // Add a small delay to ensure the component is fully rendered
    setTimeout(() => {
      onStart();
    }, 100);
  };

  // Log component mounting to help with debugging
  useEffect(() => {
    console.log("CameraPrompt component mounted");
    return () => console.log("CameraPrompt component unmounted");
  }, []);

  return (
    <>
      <Camera className="w-12 h-12 text-gray-400 mb-4" />
      <Button 
        type="button" 
        onClick={handleStartClick}
        className="bg-garden-500 hover:bg-garden-600"
        disabled={isAttemptingToStart}
      >
        {isAttemptingToStart ? "Starting Camera..." : "Open Camera"}
      </Button>
    </>
  );
};

export default CameraPrompt;
