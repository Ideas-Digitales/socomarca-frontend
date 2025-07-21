'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useTransactionsDashboard } from '@/hooks/useDashboardMaster';

export default function ClientesMasCompra() {
  // Hook maestro para dashboard de clientes con más compras
  const {
    // Estados de filtros
    amountFilter,
    reportsFilters,

    // Estados de datos
    reportsPagination,

    // Estados de tabla
    config,
    chartConfig,
    tableData: clientesFixed,
    tableColumns: clientesColumns,

    // Estados de loading
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,

    // Funciones de filtros
    handleAmountFilter,
    handleDateRangeChange,

    // Funciones de datos
    handleFilter,
    handlePageChange,

    // Función combinada
    handleClearAll,
  } = useTransactionsDashboard('Clientes con más compras', 'Clientes con más compras', {
    initialMessage: 'Cargando clientes con más compras y gráficos...',
    overlayMessage: 'Actualizando clientes...',
  });

  // Mostrar loading spinner completo solo en la carga inicial
  if (showInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando clientes con más compras y gráficos...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={clientesFixed}
        tableColumns={clientesColumns}
        productPaginationMeta={reportsPagination || undefined}
        onPageChange={handlePageChange}
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        onFilter={handleFilter}
        amountValue={amountFilter}
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
