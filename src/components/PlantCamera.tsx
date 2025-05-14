
import React, { useRef, useState, useCallback } from "react";
import { Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlantCameraProps {
  onCapture: (imageData: string) => void;
}

const PlantCamera: React.FC<PlantCameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        onCapture(imageData);
        stopCamera();
      }
    }
  }, [onCapture]);

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {!isCameraOn && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400 mb-4" />
            <Button 
              type="button" 
              onClick={startCamera}
              className="bg-garden-500 hover:bg-garden-600"
            >
              Open Camera
            </Button>
          </div>
        )}
        
        {isCameraOn && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                type="button"
                onClick={captureImage}
                className="rounded-full w-14 h-14 bg-white border-4 border-garden-500 p-0"
              >
                <span className="sr-only">Take Photo</span>
              </Button>
            </div>
          </>
        )}
        
        {capturedImage && (
          <>
            <img 
              src={capturedImage} 
              alt="Captured plant" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4">
              <Button 
                type="button"
                onClick={retake}
                variant="outline"
                size="sm"
                className="bg-white"
              >
                Retake
              </Button>
            </div>
          </>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantCamera;
