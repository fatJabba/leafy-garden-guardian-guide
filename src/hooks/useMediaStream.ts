
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function useMediaStream() {
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const startStream = async (videoElement: HTMLVideoElement | null) => {
    try {
      // Reset error states
      setPermissionError(false);
      setIsAttemptingToStart(true);
      
      // Stop any existing stream first
      stopStream();
      
      console.log("Requesting camera access...");
      
      // Critical check: Ensure videoElement is available
      if (!videoElement) {
        console.error("Video element not available");
        setIsAttemptingToStart(false);
        handleError("Video element not available");
        return false;
      }
      
      console.log("Video element is available, requesting camera access...");
      
      let stream: MediaStream;
      
      // First try environment camera (rear camera on mobile)
      try {
        console.log("Attempting to access environment camera...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
      } catch (err) {
        // If environment camera fails, try default camera
        console.log("Environment camera failed, falling back to default camera");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      
      // Store stream in ref
      streamRef.current = stream;
      
      // Connect the stream to the video element
      videoElement.srcObject = stream;
      
      console.log("Camera stream acquired and connected to video element");
      
      // Set up event listener for when metadata is loaded
      return new Promise<boolean>((resolve) => {
        videoElement.onloadedmetadata = async () => {
          try {
            await videoElement.play();
            console.log("Video started playing successfully");
            setIsStreaming(true);
            setIsAttemptingToStart(false);
            resolve(true);
          } catch (playError) {
            console.error("Error playing video:", playError);
            handleError("Failed to start video playback", playError);
            resolve(false);
          }
        };
        
        videoElement.onerror = (event) => {
          console.error("Video element error:", event);
          handleError("Video element encountered an error");
          resolve(false);
        };
      });
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      handleError("Could not access camera", err);
      return false;
    }
  };

  const handleError = (message: string, error?: any) => {
    setPermissionError(true);
    setIsAttemptingToStart(false);
    setIsStreaming(false);
    
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
    
    console.error(`Camera error: ${errorMessage}`);
    
    toast({
      title: "Camera error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const stopStream = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    setIsStreaming(false);
  };

  return {
    streamRef,
    isStreaming,
    permissionError,
    isAttemptingToStart,
    startStream,
    stopStream,
    handleError
  };
}
