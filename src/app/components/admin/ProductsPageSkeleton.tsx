import React from 'react';

const ProductsPageSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center flex-row w-full animate-pulse">
      <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full max-w-7xl">
        {/* BUSCADOR Y FILTROS */}
        <div className="w-full mb-6">
          {/* BUSCADOR */}
          <div className="w-full mb-4">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
          {/* FILTROS EN LÍNEA */}
          <div className="flex justify-start gap-4 w-full">
            <div className="w-[300px]">
              <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="w-[300px]">
              <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
        
        {/* TABLA SKELETON */}
        <div className="relative w-full">
          <div className="w-full">
            {/* Título de tabla */}
            <div className="h-7 bg-gray-200 rounded mb-4 w-32"></div>
            
            <div className="overflow-x-auto border-[1px] border-gray-200 border-solid">
              <table className="min-w-full">
                <thead className="h-full">
                  <tr>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <th
                        key={index}
                        className="bg-slate-500 text-white text-sm font-semibold py-3 px-6"
                      >
                        <div className="h-4 bg-slate-400 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-100'}
                    >
                      {Array.from({ length: 7 }).map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="text-sm py-3 px-6 text-center"
                        >
                          <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Skeleton para paginación */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageSkeleton;