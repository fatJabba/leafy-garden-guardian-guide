
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  isUploading: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRetake, isUploading }) => {
  return (
    <>
      <img 
        src={imageUrl} 
        alt="Captured plant" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 right-4">
        <Button 
          type="button"
          onClick={onRetake}
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
  );
};

export default ImagePreview;
