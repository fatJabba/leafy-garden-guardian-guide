
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

  const hasStartedCamera = useRef(false);

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
  
  const handleStartCamera = useCallback(async () => {
    // Prevent multiple calls to start camera
    if (hasStartedCamera.current || isAttemptingToStart) {
      return;
    }
    
    hasStartedCamera.current = true;
    setCameraStarted(true);
    
    try {
      // Start camera immediately without delay
      if (videoRef.current) {
        const success = await startCamera();
        if (!success) {
          toast({
            title: "Camera error",
            description: "Could not initialize camera. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Camera error",
          description: "Could not initialize camera. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      // Reset flag after attempt completes (success or failure)
      setTimeout(() => {
        hasStartedCamera.current = false;
      }, 1000);
    }
  }, [startCamera, videoRef, isAttemptingToStart]);

  const handleCaptureClick = useCallback(() => {
    const imageData = captureImage();
    if (imageData) {
      handleImageCapture(imageData);
    }
  }, [captureImage, handleImageCapture]);

  const handleRetake = useCallback(async () => {
    setCapturedImage(null);
    setCameraStarted(true);
    
    if (videoRef.current) {
      const success = await startCamera();
      if (!success) {
        toast({
          title: "Camera error",
          description: "Could not restart camera. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Camera error",
        description: "Could not restart camera. Please try again.",
        variant: "destructive"
      });
    }
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
