
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  isUploading?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  onCapture,
  isUploading = false
}) => {
  // Force video element to play when component mounts
  // This helps on iOS where autoplay might be blocked
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          // Sometimes we need to call play() again even after the initial setup
          await videoRef.current.play();
          console.log("Video element is now playing");
        } catch (error) {
          console.error("Failed to play video in CameraView:", error);
        }
      }
    };
    
    playVideo();
  }, [videoRef]);
  
  return (
    <>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <Button 
          type="button"
          onClick={onCapture}
          className="rounded-full w-14 h-14 bg-white border-4 border-garden-500 p-0"
          disabled={isUploading}
        >
          <span className="sr-only">Take Photo</span>
        </Button>
      </div>
    </>
  );
};

export default CameraView;
