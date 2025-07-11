import React from 'react';
import CardSkeleton from './CardSkeleton';

interface ProductListSkeletonProps {
  count?: number;
  className?: string;
  gridCols?: number;
}

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 8,
  className = "",
  gridCols = 4
}) => {
  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <div className={`grid gap-6 ${gridColsClasses[gridCols as keyof typeof gridColsClasses] || 'grid-cols-4'} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductListSkeleton; 