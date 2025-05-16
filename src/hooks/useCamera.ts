
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface UseCameraOptions {
  onCapture?: (imageData: string) => void;
}

export function useCamera({ onCapture }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

  const startCamera = async () => {
    try {
      // Reset error states
      setPermissionError(false);
      setIsAttemptingToStart(true);
      
      // Stop any existing stream first
      stopCamera();
      
      console.log("Requesting camera access...");
      
      // Make sure video element is available 
      if (!videoRef.current) {
        console.error("Video ref is null");
        handleCameraError("Video element not available");
        return;
      }
      
      // First try with environment camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
        videoRef.current.style.visibility = 'visible';
        
        // Wait for metadata to be loaded before playing
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            console.log("Camera started successfully");
            setIsCameraOn(true);
            setIsAttemptingToStart(false);
          } catch (playError) {
            console.error("Error playing video:", playError);
            handleCameraError("Failed to start video playback", playError);
          }
        };
        
        // Add error handler for the video element
        videoRef.current.onerror = (event) => {
          console.error("Video element error:", event);
          handleCameraError("Video element encountered an error");
        };
        
      } catch (err) {
        // If environment camera fails, try with user camera or default
        console.log("Falling back to default camera");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.style.display = 'block';
          videoRef.current.style.visibility = 'visible';
          
          // Wait for metadata to be loaded before playing
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              console.log("Camera started successfully with fallback");
              setIsCameraOn(true);
              setIsAttemptingToStart(false);
            } catch (playError) {
              console.error("Error playing video:", playError);
              handleCameraError("Failed to start video playback", playError);
            }
          };
        } catch (fallbackErr) {
          console.error("Error accessing any camera:", fallbackErr);
          handleCameraError("Could not access camera", fallbackErr);
        }
      }
    } catch (err) {
      console.error("Unexpected error in startCamera:", err);
      handleCameraError("Camera initialization failed", err);
    }
  };
  
  const handleCameraError = (message: string, error?: any) => {
    setPermissionError(true);
    setIsAttemptingToStart(false);
    setIsCameraOn(false);
    
    // Show more specific error information
    let errorMessage = message;
    if (error) {
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Camera doesn't support the requested resolution or capabilities.";
      } else if (error.name === "AbortError") {
        errorMessage = "Camera initialization was aborted.";
      }
    }
    
    toast({
      title: "Camera error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
    }
    
    setIsCameraOn(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL("image/jpeg");
        if (onCapture) {
          onCapture(imageData);
        }
        stopCamera();
        return imageData;
      }
    }
    return null;
  };

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    streamRef,
    isCameraOn,
    permissionError,
    isAttemptingToStart,
    startCamera,
    stopCamera,
    captureImage
  };
}
