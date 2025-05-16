
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
      setPermissionError(false);
      setIsAttemptingToStart(true);
      
      // Stop any existing stream first to ensure clean restart
      stopCamera();
      
      const constraints = {
        video: { 
          facingMode: "environment", // Try using a simple string first
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Store the stream reference
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log("Setting video stream...");
        
        // Ensure the video element has proper styling
        if (videoRef.current.style) {
          videoRef.current.style.visibility = 'visible';
          videoRef.current.style.display = 'block';
        }
        
        // Explicitly set srcObject
        videoRef.current.srcObject = stream;
        
        // Add event listeners to detect when video starts playing
        videoRef.current.onloadedmetadata = async () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, attempting to play...");
            
            try {
              await videoRef.current.play();
              console.log("Camera started successfully");
              setIsCameraOn(true);
              setIsAttemptingToStart(false);
            } catch (error) {
              console.error("Error playing video:", error);
              handleCameraError("Failed to start video playback", error);
              
              // Try again with a timeout, which can help on some browsers
              setTimeout(async () => {
                try {
                  if (videoRef.current) {
                    await videoRef.current.play();
                    console.log("Camera started on second attempt");
                    setIsCameraOn(true);
                    setIsAttemptingToStart(false);
                  }
                } catch (retryError) {
                  console.error("Error on retry:", retryError);
                  handleCameraError("Failed to start camera after retry", retryError);
                }
              }, 500);
            }
          }
        };
        
        // Add error handler for the video element
        videoRef.current.onerror = (event) => {
          console.error("Video element error:", event);
          handleCameraError("Video element encountered an error");
        };
      } else {
        console.error("Video ref is null");
        handleCameraError("Video reference not available");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      handleCameraError("Could not access camera", err);
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
    console.log("Stopping camera...");
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
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
