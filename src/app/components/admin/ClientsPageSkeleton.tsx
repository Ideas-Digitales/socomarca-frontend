import React from 'react';

const ClientsPageSkeleton: React.FC = () => {
  return (
    <div className="p-6 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded mb-2 w-64"></div>
        <div className="h-5 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>

          {/* Filtro de estado */}
          <div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>

          {/* Ordenamiento */}
          <div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>

          {/* Botón de orden ascendente/descendente */}
          <div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="w-full">
          {/* Título de tabla */}
          <div className="h-7 bg-gray-200 rounded mb-4 w-40"></div>
          
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
                        {colIndex === 0 ? (
                          // Primera columna (nombre) con dos líneas
                          <div className="text-left">
                            <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ) : colIndex === 4 ? (
                          // Columna de estado (con badge)
                          <div className="text-center">
                            <div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div>
                          </div>
                        ) : (
                          // Otras columnas
                          <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                        )}
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

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="h-6 bg-blue-200 rounded mb-2 w-32"></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 bg-blue-200 rounded w-full max-w-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientsPageSkeleton;