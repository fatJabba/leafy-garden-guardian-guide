
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
      
      // Critical check: Ensure videoElement is available
      if (!videoElement) {
        setIsAttemptingToStart(false);
        handleError("Video element not available");
        return false;
      }
      
      let stream: MediaStream;
      
      try {
        // Try with basic video constraints first
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (err) {
        // If that fails, try with more specific constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
      }
      
      // Store stream in ref
      streamRef.current = stream;
      
      // Connect the stream to the video element
      videoElement.srcObject = stream;
      
      // Wait for metadata to load and then play the video
      return new Promise<boolean>((resolve) => {
        const onMetadataLoaded = async () => {
          try {
            await videoElement.play();
            setIsStreaming(true);
            setIsAttemptingToStart(false);
            resolve(true);
          } catch (playError) {
            handleError("Failed to start video playback", playError);
            resolve(false);
          }
        };
        
        const onError = () => {
          handleError("Video element encountered an error");
          resolve(false);
        };
        
        // Add event listeners
        videoElement.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
        videoElement.addEventListener('error', onError, { once: true });
        
        // Cleanup function for the promise in case of timeout
        setTimeout(() => {
          videoElement.removeEventListener('loadedmetadata', onMetadataLoaded);
          videoElement.removeEventListener('error', onError);
          if (!isStreaming) {
            handleError("Timed out waiting for video to start");
            resolve(false);
          }
        }, 10000); // 10 second timeout
      });
      
    } catch (err) {
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
