
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Image, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { uploadImageToSupabase } from "@/utils/supabaseStorage";

interface PlantCameraProps {
  onCapture: (imageData: string, imagePath?: string | null) => void;
}

const PlantCamera: React.FC<PlantCameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

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

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  const captureImage = useCallback(async () => {
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
        
        setIsUploading(true);
        // Upload the image to Supabase
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
          stopCamera();
        }
      }
    }
  }, [onCapture]);

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {!isCameraOn && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {permissionError ? (
              <div className="text-center p-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Camera access denied</h3>
                <p className="text-muted-foreground mb-4">
                  Please enable camera access in your browser settings or upload an image instead.
                </p>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload image"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-4" />
                <Button 
                  type="button" 
                  onClick={startCamera}
                  className="bg-garden-500 hover:bg-garden-600"
                  disabled={isAttemptingToStart}
                >
                  {isAttemptingToStart ? "Starting Camera..." : "Open Camera"}
                </Button>
              </>
            )}
          </div>
        )}
        
        {isCameraOn && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                type="button"
                onClick={captureImage}
                className="rounded-full w-14 h-14 bg-white border-4 border-garden-500 p-0"
                disabled={isUploading}
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
                disabled={isUploading}
              >
                Retake
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-garden-500" />
                  <span>Uploading image...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PlantCamera;
