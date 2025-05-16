
import React from "react";
import CameraView from "@/components/camera/CameraView";
import CameraPrompt from "@/components/camera/CameraPrompt";
import CameraError from "@/components/camera/CameraError";
import ImagePreview from "@/components/camera/ImagePreview";

interface CameraContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  capturedImage: string | null;
  isCameraOn: boolean;
  permissionError: boolean;
  isUploading: boolean;
  isAttemptingToStart: boolean;
  onStartCamera: () => void;
  onCaptureClick: () => void;
  onRetake: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraContainer: React.FC<CameraContainerProps> = ({
  videoRef,
  canvasRef,
  capturedImage,
  isCameraOn,
  permissionError,
  isUploading,
  isAttemptingToStart,
  onStartCamera,
  onCaptureClick,
  onRetake,
  onImageUpload
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {!isCameraOn && !capturedImage && !permissionError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CameraPrompt 
              onStart={onStartCamera} 
              isAttemptingToStart={isAttemptingToStart} 
            />
          </div>
        )}
        
        {permissionError && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CameraError 
              onRetry={onStartCamera} 
              onUpload={onImageUpload} 
              isUploading={isUploading} 
            />
          </div>
        )}
        
        {isCameraOn && !capturedImage && (
          <CameraView 
            videoRef={videoRef}
            onCapture={onCaptureClick}
            isUploading={isUploading}
          />
        )}
        
        {capturedImage && (
          <ImagePreview 
            imageUrl={capturedImage}
            onRetake={onRetake}
            isUploading={isUploading}
          />
        )}
      </div>
      
      {/* Canvas used for capturing the image */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraContainer;
