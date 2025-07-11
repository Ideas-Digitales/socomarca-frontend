import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface TableLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const TableLoadingOverlay: React.FC<TableLoadingOverlayProps> = ({ 
  isLoading, 
  message = "Cargando datos..." 
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3 p-6 bg-white rounded-lg shadow-lg">
        <LoadingSpinner size="md" />
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default TableLoadingOverlay; 