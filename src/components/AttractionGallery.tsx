import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AttractionGalleryProps {
  images: string[];
}

/**
 * Gallery component for displaying attraction images
 * Shows a grid of thumbnails and allows viewing full images in a modal
 */
export function AttractionGallery({ images }: AttractionGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle image click to show modal
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setSelectedImage(null);
  };

  // If no images are available
  if (!images.length) {
    return (
      <div className="my-8 p-12 border rounded-md text-center bg-gray-50">
        <p className="text-gray-500">No images available for this attraction</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Dialog key={index} open={selectedImage === image} onOpenChange={(open) => {
            if (!open) handleDialogClose();
          }}>
            <DialogTrigger asChild>
              <div 
                onClick={() => handleImageClick(image)}
                className="cursor-pointer overflow-hidden rounded-md aspect-square bg-gray-100 relative hover:opacity-90 transition-opacity"
              >
                <img 
                  src={image} 
                  alt={`Attraction image ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy" // For performance optimization
                />
              </div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-3xl max-h-[90vh] p-1">
              <div className="w-full h-full overflow-hidden flex items-center justify-center">
                <img 
                  src={image} 
                  alt={`Attraction image ${index + 1}`}
                  className="object-contain max-w-full max-h-[80vh]"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
} 