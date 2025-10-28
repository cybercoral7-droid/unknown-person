import React from 'react';

const ImageGallerySkeleton: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto flex justify-center animate-pulse">
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-xl aspect-[4/3]"></div>
  </div>
);

export default ImageGallerySkeleton;