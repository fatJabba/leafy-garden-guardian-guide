
import React, { useState, useCallback, useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { uploadImageToSupabase } from "@/utils/supabaseStorage";
import { toast } from "@/hooks/use-toast";
import CameraView from "@/components/camera/CameraView";
import CameraPrompt from "@/components/camera/CameraPrompt";
import CameraError from "@/components/camera/CameraError";
import ImagePreview from "@/components/camera/ImagePreview";

interface PlantCameraProps {
  onCapture: (imageData: string, imagePath?: string | null) => void;
}

const PlantCamera: React.FC<PlantCameraProps> = ({ onCapture }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  
  const handleImageCapture = useCallback(async (imageData: string) => {
    setCapturedImage(imageData);
    setIsUploading(true);
    
    try {
      const imagePath = await uploadImageToSupabase(imageData);
      onCapture(imageData, imagePath);
      if (imagePath) {
        toast({
          title: "Image uploaded",
          description: "Your plant image has been saved to the cloud.",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "We couldn't upload your image. The local version will still be used.",
        variant: "destructive"
      });
      // Still pass the local image even if upload failed
      onCapture(imageData, null);
    } finally {
      setIsUploading(false);
    }
  }, [onCapture]);

  const { 
    videoRef, 
    canvasRef, 
    isCameraOn, 
    permissionError,
    isAttemptingToStart,
    startCamera,
    stopCamera,
    captureImage
  } = useCamera();

  // Auto-start camera when component mounts if user has already granted permission
  useEffect(() => {
    // Automatically start the camera after a short delay to let the component fully mount
    const timeoutId = setTimeout(() => {
      handleStartCamera();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-restart camera when needed
  useEffect(() => {
    if (cameraStarted && !isCameraOn && !isAttemptingToStart && !permissionError && !capturedImage) {
      console.log("Attempting to restart camera...");
      const timeoutId = setTimeout(() => {
        startCamera();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [cameraStarted, isCameraOn, isAttemptingToStart, permissionError, startCamera, capturedImage]);

  const handleStartCamera = useCallback(() => {
    setCameraStarted(true);
    startCamera();
  }, [startCamera]);

  const handleCaptureClick = useCallback(() => {
    const imageData = captureImage();
    if (imageData) {
      handleImageCapture(imageData);
    }
  }, [captureImage, handleImageCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCameraStarted(true);
    startCamera();
  }, [startCamera]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        setCapturedImage(imageData);
        
        setIsUploading(true);
        try {
          const imagePath = await uploadImageToSupabase(imageData);
          onCapture(imageData, imagePath);
          if (imagePath) {
            toast({
              title: "Image uploaded",
              description: "Your plant image has been saved to the cloud.",
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Upload failed",
            description: "We couldn't upload your image. The local version will still be used.",
            variant: "destructive"
          });
          // Still pass the local image even if upload failed
          onCapture(imageData, null);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {!isCameraOn && !capturedImage && !permissionError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CameraPrompt 
              onStart={handleStartCamera} 
              isAttemptingToStart={isAttemptingToStart} 
            />
          </div>
        )}
        
        {permissionError && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CameraError 
              onRetry={handleStartCamera} 
              onUpload={handleImageUpload} 
              isUploading={isUploading} 
            />
          </div>
        )}
        
        {isCameraOn && !capturedImage && (
          <CameraView 
            videoRef={videoRef}
            onCapture={handleCaptureClick}
            isUploading={isUploading}
          />
        )}
        
        {capturedImage && (
          <ImagePreview 
            imageUrl={capturedImage}
            onRetake={retake}
            isUploading={isUploading}
          />
        )}
      </div>
      
      {/* Canvas used for capturing the image */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantCamera;
