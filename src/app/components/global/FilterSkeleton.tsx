import React from 'react';

interface FilterSkeletonProps {
  width?: string;
  height?: string;
  type?: 'dropdown' | 'search' | 'button';
  label?: string;
}

const FilterSkeleton: React.FC<FilterSkeletonProps> = ({ 
  width = "w-64", 
  height = "h-10",
  type = 'dropdown',
  label
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dropdown':
        return (
          <div className="space-y-2">
            {label && <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>}
            <div className={`${height} bg-gray-200 rounded animate-pulse`}></div>
          </div>
        );
      case 'search':
        return (
          <div className="space-y-2">
            {label && <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>}
            <div className={`${height} bg-gray-200 rounded-lg animate-pulse`}></div>
          </div>
        );
      case 'button':
        return (
          <div className={`${height} bg-gray-200 rounded animate-pulse`}></div>
        );
      default:
        return <div className={`${height} bg-gray-200 rounded animate-pulse`}></div>;
    }
  };

  return (
    <div className={`${width} my-4`}>
      {renderSkeleton()}
    </div>
  );
};

export default FilterSkeleton; 