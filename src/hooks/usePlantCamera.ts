
import { useState, useCallback, useRef } from "react";
import { useCamera } from "@/hooks/useCamera";
import { uploadImageToSupabase } from "@/utils/supabaseStorage";
import { toast } from "@/hooks/use-toast";

export function usePlantCamera(onCapture: (imageData: string, imagePath?: string | null) => void) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  
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
  
  const handleStartCamera = useCallback(() => {
    console.log("Starting camera from usePlantCamera hook...");
    setCameraStarted(true);
    
    // Use a small delay to ensure component has fully rendered
    setTimeout(() => {
      if (videoRef.current) {
        console.log("Video ref is available in usePlantCamera, starting camera");
        startCamera();
      } else {
        console.error("Video ref is not available even after delay in usePlantCamera");
        toast({
          title: "Camera error",
          description: "Could not initialize camera. Please try again.",
          variant: "destructive"
        });
      }
    }, 300); // Increased delay to ensure DOM is ready
  }, [startCamera, videoRef]);

  const handleCaptureClick = useCallback(() => {
    const imageData = captureImage();
    if (imageData) {
      handleImageCapture(imageData);
    }
  }, [captureImage, handleImageCapture]);

  const handleRetake = useCallback(() => {
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
    }, 300); // Increased delay to ensure DOM is ready
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
  
  return {
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
  };
}
