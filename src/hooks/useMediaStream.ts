
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function useMediaStream() {
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

  const startStream = async (videoElement: HTMLVideoElement | null) => {
    try {
      // Reset error states
      setPermissionError(false);
      setIsAttemptingToStart(true);
      
      // Stop any existing stream first
      stopStream();
      
      console.log("Requesting camera access...");
      
      // Critical check: Wait for videoElement to be available
      if (!videoElement) {
        console.error("Video element not available");
        setIsAttemptingToStart(false);
        handleError("Video element not available");
        return;
      }
      
      console.log("Video element is available, preparing to access camera...");
      
      // First try with environment camera (for mobile devices)
      try {
        console.log("Attempting to access environment camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        
        streamRef.current = stream;
        
        // Connect the stream to the video element
        videoElement.srcObject = stream;
        videoElement.style.display = 'block';
        videoElement.style.visibility = 'visible';
        
        console.log("Connected camera stream to video element");
        
        // Wait for metadata to be loaded before playing
        videoElement.onloadedmetadata = async () => {
          try {
            await videoElement.play();
            console.log("Camera started successfully with environment camera");
            setIsStreaming(true);
            setIsAttemptingToStart(false);
          } catch (playError) {
            console.error("Error playing video:", playError);
            handleError("Failed to start video playback", playError);
          }
        };
        
        // Add error handler for the video element
        videoElement.onerror = (event) => {
          console.error("Video element error:", event);
          handleError("Video element encountered an error");
        };
      } catch (err) {
        // If environment camera fails, try with user camera or default
        console.log("Environment camera failed, falling back to default camera");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          
          streamRef.current = stream;
          
          // Double-check video element again
          if (videoElement) {
            // Connect the stream to the video element
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            videoElement.style.visibility = 'visible';
            
            console.log("Connected fallback camera stream to video element");
            
            // Wait for metadata to be loaded before playing
            videoElement.onloadedmetadata = async () => {
              try {
                await videoElement.play();
                console.log("Camera started successfully with fallback camera");
                setIsStreaming(true);
                setIsAttemptingToStart(false);
              } catch (playError) {
                console.error("Error playing video:", playError);
                handleError("Failed to start video playback", playError);
              }
            };
          } else {
            throw new Error("Video element became unavailable during fallback");
          }
        } catch (fallbackErr) {
          console.error("Error accessing any camera:", fallbackErr);
          handleError("Could not access camera", fallbackErr);
        }
      }
    } catch (err) {
      console.error("Unexpected error in startStream:", err);
      handleError("Camera initialization failed", err);
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

  // Clean up stream resources when component unmounts
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

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
