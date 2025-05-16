
import React, { useEffect, useRef } from "react";
import { usePlantCamera } from "@/hooks/usePlantCamera";
import CameraContainer from "@/components/camera/CameraContainer";

interface PlantCameraProps {
  onCapture: (imageData: string, imagePath?: string | null) => void;
}

const PlantCamera: React.FC<PlantCameraProps> = ({ onCapture }) => {
  // Create a mount state ref to track component mounting
  const isMountedRef = useRef(false);
  
  const {
    videoRef, 
    canvasRef,
    capturedImage,
    isUploading,
    isCameraOn,
    permissionError,
    isAttemptingToStart,
    handleStartCamera,
    handleCaptureClick,
    handleRetake,
    handleImageUpload,
    setCameraStarted
  } = usePlantCamera(onCapture);

  // Set mounted ref to true once component is mounted
  useEffect(() => {
    console.log("PlantCamera component mounted");
    isMountedRef.current = true;
    
    return () => {
      // Reset camera started state and mounted ref on unmount
      console.log("PlantCamera component unmounting");
      setCameraStarted(false);
      isMountedRef.current = false;
    };
  }, [setCameraStarted]);

  // Custom camera start handler that ensures component is mounted
  const startCamera = () => {
    console.log("Starting camera from PlantCamera, mounted:", isMountedRef.current);
    if (isMountedRef.current && videoRef.current) {
      console.log("Video element available:", videoRef.current);
      handleStartCamera();
    } else {
      console.error("Cannot start camera - component not fully mounted or video element unavailable");
    }
  };

  return (
    <CameraContainer
      videoRef={videoRef}
      canvasRef={canvasRef}
      capturedImage={capturedImage}
      isCameraOn={isCameraOn}
      permissionError={permissionError}
      isUploading={isUploading}
      isAttemptingToStart={isAttemptingToStart}
      onStartCamera={startCamera}
      onCaptureClick={handleCaptureClick}
      onRetake={handleRetake}
      onImageUpload={handleImageUpload}
    />
  );
};

export default PlantCamera;
