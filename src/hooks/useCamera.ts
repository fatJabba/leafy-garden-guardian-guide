
import { useState, useRef } from "react";
import { useMediaStream } from "./useMediaStream";
import { captureImageFromVideo } from "@/utils/cameraUtils";

export interface UseCameraOptions {
  onCapture?: (imageData: string) => void;
}

export function useCamera({ onCapture }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const { 
    streamRef,
    permissionError, 
    isAttemptingToStart,
    startStream, 
    stopStream
  } = useMediaStream();

  const startCamera = async () => {
    await startStream(videoRef.current);
    setIsCameraOn(true);
  };

  const stopCamera = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
    }
    
    stopStream();
    setIsCameraOn(false);
  };

  const captureImage = () => {
    const imageData = captureImageFromVideo(videoRef.current, canvasRef.current);
    
    if (imageData && onCapture) {
      onCapture(imageData);
    }
    
    stopCamera();
    return imageData;
  };

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
