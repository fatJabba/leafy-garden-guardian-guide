
import React from "react";
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
