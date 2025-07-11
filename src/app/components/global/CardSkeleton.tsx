import React from 'react';

interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = "",
  showImage = true,
  showTitle = true,
  showDescription = true,
  showPrice = true,
  showButton = true
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      )}
      
      <div className="space-y-3">
        {showTitle && (
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        )}
        
        {showDescription && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        )}
        
        {showPrice && (
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
        )}
        
        {showButton && (
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        )}
      </div>
    </div>
  );
};

export default CardSkeleton; 