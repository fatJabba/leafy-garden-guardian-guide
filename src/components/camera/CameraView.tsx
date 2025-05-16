
import React from "react";
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
          objectFit: 'cover',
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
