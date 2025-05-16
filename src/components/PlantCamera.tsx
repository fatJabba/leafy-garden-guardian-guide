
import React, { useState, useCallback, useEffect, useRef } from "react";
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
  const videoMountedRef = useRef(false);
  
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

  // Ensure we only try to start the camera when the user explicitly requests it
  
  const handleStartCamera = useCallback(() => {
    console.log("Starting camera...");
    setCameraStarted(true);
    
    // Use a small delay to ensure component has fully rendered
    setTimeout(() => {
      if (videoRef.current) {
        console.log("Video ref is available, starting camera");
        startCamera();
      } else {
        console.error("Video ref is not available even after delay");
        toast({
          title: "Camera error",
          description: "Could not initialize camera. Please try again.",
          variant: "destructive"
        });
      }
    }, 100);
  }, [startCamera, videoRef]);

  const handleCaptureClick = useCallback(() => {
    const imageData = captureImage();
    if (imageData) {
      handleImageCapture(imageData);
    }
  }, [captureImage, handleImageCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCameraStarted(true);
    
    // Use a small delay to ensure component has fully rendered
    setTimeout(() => {
      if (videoRef.current) {
        startCamera();
      } else {
        console.error("Video ref is not available for retake");
        toast({
          title: "Camera error",
          description: "Could not restart camera. Please try again.",
          variant: "destructive"
        });
      }
    }, 100);
  }, [startCamera, videoRef]);

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
  
  // Track when the video element is actually mounted in the DOM
  useEffect(() => {
    if (cameraStarted && videoRef.current && !videoMountedRef.current) {
      videoMountedRef.current = true;
      console.log("Video element is now mounted in the DOM");
    }
    
    // Clean up cameras when unmounting
    return () => {
      stopCamera();
    };
  }, [cameraStarted, stopCamera, videoRef]);

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
