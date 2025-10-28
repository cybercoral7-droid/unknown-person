
import React from 'react';

interface ImageGalleryProps {
  images: string[];
  dishName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, dishName }) => (
    <div className="w-full max-w-3xl mx-auto flex justify-center">
        {images.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                    src={src}
                    alt={`${dishName} - Image ${index + 1}`}
                    className="w-full h-full object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-300"
                />
            </div>
        ))}
    </div>
);

export default ImageGallery;