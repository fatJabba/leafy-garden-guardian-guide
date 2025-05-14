
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
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log("Setting video stream...");
        videoRef.current.srcObject = stream;
        
        // Force play when metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, attempting to play...");
            // Using setTimeout to ensure DOM is ready
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play()
                  .then(() => {
                    console.log("Camera started successfully");
                    setIsCameraOn(true);
                    setIsAttemptingToStart(false);
                  })
                  .catch((error) => {
                    console.error("Error playing video:", error);
                    setPermissionError(true);
                    setIsAttemptingToStart(false);
                    toast({
                      title: "Camera error",
                      description: "There was a problem starting your camera. Please try again.",
                      variant: "destructive"
                    });
                  });
              }
            }, 100);
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermissionError(true);
      setIsAttemptingToStart(false);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access in your browser settings to use this feature.",
        variant: "destructive"
      });
    }
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
