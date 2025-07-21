'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useMunicipalitiesDashboard } from '@/hooks/useDashboardMaster';

export default function ComunasMasVentas() {
  // Hook maestro para dashboard de municipalidades con más ventas
  const {
    // Estados de filtros
    reportsFilters,

    // Estados de datos
    reportsPagination,

    // Estados de tabla
    config,
    chartConfig,
    tableData: municipalitiesFormatted,
    tableColumns: municipalitiesColumns,

    // Estados de loading
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,

    // Funciones de filtros
    handleDateRangeChange,

    // Funciones de datos
    handleFilter,
    handlePageChange,

    // Función combinada
    handleClearAll,
  } = useMunicipalitiesDashboard('Municipalidades con más ventas', 'Municipalidades con más ventas', {
    enableAmountFilter: false, // Deshabilitar filtro de montos
    initialMessage: 'Cargando datos de municipalidades...',
    overlayMessage: 'Actualizando municipalidades...',
  });

  // Mostrar loading spinner completo solo en la carga inicial
  if (showInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando datos de municipalidades...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={municipalitiesFormatted}
        tableColumns={municipalitiesColumns}
        productPaginationMeta={reportsPagination || undefined}
        onPageChange={handlePageChange}
        chartConfig={chartConfig}
        showDatePicker={true}
        onFilter={handleFilter}
        onClearSearch={handleClearAll}
        searchableDropdown={false}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: reportsFilters.start || undefined,
          end: reportsFilters.end || undefined,
        }}
        onResetFilters={handleClearAll}
      />

      {/* Loading overlay sutil para cambios de página/filtros */}
      {showOverlayLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">{loadingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

