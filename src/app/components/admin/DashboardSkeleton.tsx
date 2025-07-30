import React from 'react';

interface DashboardSkeletonProps {
  showSearch?: boolean;
  showFilters?: boolean;
  showDatePicker?: boolean;
  showMetricsChart?: boolean;
  showBottomChart?: boolean;
  showTable?: boolean;
  tableColumns?: number;
  tableRows?: number;
  showAmountFilter?: boolean;
  showClientFilter?: boolean;
  showCategoryFilter?: boolean;
  showCommuneFilter?: boolean;
  showSortFilter?: boolean;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  showSearch = true,
  showFilters = true,
  showDatePicker = true,
  showMetricsChart = true,
  showBottomChart = false,
  showTable = true,
  tableColumns = 5,
  tableRows = 8,
  showAmountFilter = false,
  showClientFilter = false,
  showCategoryFilter = false,
  showCommuneFilter = false,
  showSortFilter = false,
}) => {
  return (
    <div className="flex flex-col w-full bg-white animate-pulse">
      {/* FILTROS SIEMPRE ARRIBA - Primera sección */}
      <div className="flex flex-col justify-between items-center h-full w-full max-w-7xl px-4 md:px-8 py-4">
        {/* Search Bar Skeleton */}
        {showSearch && (
          <div className="w-full mb-4">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        )}

        {/* Filter Options Skeleton */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-wrap gap-3 flex-1">
              {/* Filtrar Button */}
              <div className="h-10 w-20 bg-lime-200 rounded-md"></div>
              
              {/* Limpiar Button */}
              <div className="h-10 w-20 bg-gray-200 rounded-md"></div>

              {/* Amount Filter */}
              {showAmountFilter && (
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
                </div>
              )}

              {/* Client Filter */}
              {showClientFilter && (
                <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
              )}

              {/* Category Filter */}
              {showCategoryFilter && (
                <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
              )}

              {/* Commune Filter */}
              {showCommuneFilter && (
                <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
              )}

              {/* Sort Filter */}
              {showSortFilter && (
                <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
              )}
            </div>

            {/* Download Button */}
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
        )}
      </div>

      {/* Header Section con DatePicker y Gráficos */}
      {(showDatePicker || showMetricsChart) && (
        <div className="flex flex-col md:flex-row py-7 px-4 md:px-12 items-center gap-7">
          {/* DatePicker Skeleton */}
          {showDatePicker && (
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex h-full items-center">
                <div className="h-20 w-80 bg-gray-200 rounded-md border border-gray-300"></div>
              </div>
            </div>
          )}

          {/* Gráfico principal con métricas */}
          {showMetricsChart && (
            <div className="flex flex-col items-start gap-4 flex-1-0-0 w-full">
              <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
                {/* Métricas Skeleton */}
                <div className="flex items-start gap-4">
                  <div className="w-1/2">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-1/2">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                {/* Gráfico Skeleton */}
                <div className="flex w-full items-center">
                  <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráfico inferior */}
      {showBottomChart && (
        <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
          <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
            <div className="text-lime-500">
              <div className="h-4 bg-gray-200 rounded mb-2 w-40"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de tabla */}
      {showTable && (
        <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
          <div className="w-full">
            {/* Título de tabla */}
            <div className="h-7 bg-gray-200 rounded mb-4 w-48"></div>
            
            <div className="overflow-x-auto border-[1px] border-gray-200 border-solid">
              <table className="min-w-full">
                <thead className="h-full">
                  <tr>
                    {Array.from({ length: tableColumns }).map((_, index) => (
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
                  {Array.from({ length: tableRows }).map((_, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-100'}
                    >
                      {Array.from({ length: tableColumns }).map((_, colIndex) => (
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
      )}
    </div>
  );
};

export default DashboardSkeleton;