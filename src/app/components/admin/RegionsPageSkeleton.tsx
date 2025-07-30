import React from 'react';

const RegionsPageSkeleton: React.FC = () => {
  return (
    <div className="bg-[#f5f9fc] p-6 rounded-md max-w-3xl mx-auto animate-pulse">
      {/* Título */}
      <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>

      {/* Campo de búsqueda */}
      <div className="mb-6 w-full h-10 bg-gray-200 rounded border border-gray-300"></div>

      {/* Lista de regiones skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded bg-white">
            {/* Header de región */}
            <div className="w-full flex justify-between items-center px-4 py-2">
              <div className="h-5 bg-gray-200 rounded w-48"></div>
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Comunas expandidas (simulamos algunas expandidas) */}
            {index % 3 === 0 && (
              <div className="px-6 pb-4">
                <div className="space-y-2 mt-2">
                  {Array.from({ length: 4 }).map((_, comunaIndex) => (
                    <div key={comunaIndex} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de guardar y mensajes */}
      <div className="mt-6 flex flex-col items-end">
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
        <div className="mt-2 h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default RegionsPageSkeleton;