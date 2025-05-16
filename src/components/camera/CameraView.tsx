
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

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
  // Create a local reference to track if we've attempted to start the video
  const hasAttemptedPlay = useRef(false);
  
  // Force video element to play when component mounts
  useEffect(() => {
    console.log("CameraView mounted - checking video element");
    
    const playVideo = async () => {
      if (videoRef.current && !hasAttemptedPlay.current) {
        try {
          hasAttemptedPlay.current = true;
          
          // Make sure the video element is explicitly visible
          if (videoRef.current.style) {
            videoRef.current.style.visibility = 'visible';
            videoRef.current.style.display = 'block';
            videoRef.current.style.width = '100%';
            videoRef.current.style.height = '100%';
            
            // Log the state of the video element
            console.log("Video element state:", {
              width: videoRef.current.offsetWidth,
              height: videoRef.current.offsetHeight,
              display: videoRef.current.style.display,
              visibility: videoRef.current.style.visibility,
              srcObject: videoRef.current.srcObject ? "exists" : "null"
            });
          }
          
          // Only try to play if we have a srcObject
          if (videoRef.current.srcObject) {
            await videoRef.current.play();
            console.log("Video element is now playing");
          } else {
            console.warn("Video element has no srcObject, cannot play");
          }
        } catch (error) {
          console.error("Failed to play video in CameraView:", error);
        }
      } else if (!videoRef.current) {
        console.error("Video ref is null in CameraView useEffect");
      }
    };
    
    // Add a delay to ensure the video element is in the DOM
    const timeoutId = setTimeout(playVideo, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [videoRef]);
  
  return (
    <div className="relative w-full h-full min-h-[300px] bg-gray-100 overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{ 
          display: 'block',
          visibility: 'visible',
          minHeight: '300px',
        }}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <Button 
          type="button"
          onClick={onCapture}
          className="rounded-full w-14 h-14 bg-white border-4 border-garden-500 p-0 flex items-center justify-center"
          disabled={isUploading}
          aria-label="Take Photo"
        >
          <Camera className="h-6 w-6 text-garden-500" />
          <span className="sr-only">Take Photo</span>
        </Button>
      </div>
    </div>
  );
};

export default CameraView;
