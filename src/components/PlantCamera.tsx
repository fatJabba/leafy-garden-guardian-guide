
import React, { useEffect } from "react";
import { usePlantCamera } from "@/hooks/usePlantCamera";
import CameraContainer from "@/components/camera/CameraContainer";

interface PlantCameraProps {
  onCapture: (imageData: string, imagePath?: string | null) => void;
}

const PlantCamera: React.FC<PlantCameraProps> = ({ onCapture }) => {
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

  // Clean up camera state when component unmounts
  useEffect(() => {
    return () => {
      // Reset camera started state on unmount
      setCameraStarted(false);
    };
  }, [setCameraStarted]);

  return (
    <CameraContainer
      videoRef={videoRef}
      canvasRef={canvasRef}
      capturedImage={capturedImage}
      isCameraOn={isCameraOn}
      permissionError={permissionError}
      isUploading={isUploading}
      isAttemptingToStart={isAttemptingToStart}
      onStartCamera={handleStartCamera}
      onCaptureClick={handleCaptureClick}
      onRetake={handleRetake}
      onImageUpload={handleImageUpload}
    />
  );
};

export default PlantCamera;
