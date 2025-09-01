import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Button from './Button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  existingImages?: string[];
  className?: string;
}

function ImageUpload({ 
  onUpload, 
  maxFiles = 5, 
  existingImages = [], 
  className 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newPreviews = [...previews, ...uploadedUrls].slice(0, maxFiles);
      setPreviews(newPreviews);
      onUpload(newPreviews);
    } catch (error) {
      console.error('Upload failed:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onUpload(newPreviews);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-border"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {previews.length < maxFiles && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/20"
          >
            {uploading ? (
              <div className="animate-spin">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center">
                  Click to upload
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || previews.length >= maxFiles}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{previews.length} of {maxFiles} images</span>
        {previews.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreviews([]);
              onUpload([]);
            }}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;