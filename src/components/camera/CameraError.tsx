
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraErrorProps {
  onRetry: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const CameraError: React.FC<CameraErrorProps> = ({ onRetry, onUpload, isUploading }) => {
  return (
    <div className="text-center p-4">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h3 className="font-medium text-lg mb-2">Camera access denied</h3>
      <p className="text-muted-foreground mb-4">
        Please enable camera access in your browser settings or upload an image instead.
      </p>
      <div className="space-y-3">
        <Button 
          type="button" 
          onClick={onRetry}
          variant="outline"
          className="w-full"
          disabled={isUploading}
        >
          Try again
        </Button>
        <div className="relative">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onUpload}
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
    </div>
  );
};

export default CameraError;
