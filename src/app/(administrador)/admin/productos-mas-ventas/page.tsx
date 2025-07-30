'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { ProductosMasVentasSkeleton } from '@/app/components/admin/DashboardSkeletonConfigs';
import { useProductsDashboard } from '@/hooks/useDashboardMaster';



export default function ProductosMasVentas() {
  // Hook maestro para dashboard de productos con más ventas
  const {
    // Estados de filtros
    reportsFilters,

    // Estados de datos
    reportsPagination,

    // Estados de tabla
    config,
    chartConfig,
    tableData: productosFormatted,
    tableColumns: productosColumns,

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
  } = useProductsDashboard('Productos con más ventas', 'Productos con más ventas', {
    enableClientFilter: false, // Deshabilitar filtro de clientes
    enableAmountFilter: false, // Deshabilitar filtro de montos
    initialMessage: 'Cargando datos de productos...',
    overlayMessage: 'Actualizando productos...',
  });

  // Mostrar skeleton completo solo en la carga inicial
  if (showInitialLoading) {
    return <ProductosMasVentasSkeleton />;
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={productosFormatted}
        tableColumns={productosColumns}
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
