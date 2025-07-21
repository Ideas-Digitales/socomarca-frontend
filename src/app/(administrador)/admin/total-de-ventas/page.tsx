'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useTransactionsDashboard } from '@/hooks/useDashboardMaster';

export default function TotalDeVentas() {
  // Hook maestro para dashboard de transacciones
  const {
    // Estados de filtros
    selectedClients,
    amountFilter,
    clients,
    customers,
    reportsFilters,

    // Estados de datos
    reportsPagination,

    // Estados de tabla
    config,
    chartConfig,
    tableData: ventasFixed,
    tableColumns: ventasColumns,

    // Estados de loading
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,

    // Funciones de filtros
    handleAmountFilter,
    handleClientFilter,
    handleDateRangeChange,

    // Funciones de datos
    handleFilter,
    handlePageChange,

    // Función combinada
    handleClearAll,
  } = useTransactionsDashboard('Total de ventas', 'Total de ventas', {
    initialMessage: 'Cargando ventas y gráficos...',
    overlayMessage: 'Actualizando ventas...',
  });

  // Mostrar loading spinner completo solo en la carga inicial
  if (showInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando ventas y gráficos...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={ventasFixed}
        tableColumns={ventasColumns}
        productPaginationMeta={reportsPagination || undefined}
        onPageChange={handlePageChange}
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        onClientFilter={handleClientFilter}
        onFilter={handleFilter}
        clients={clients}
        customers={customers}
        selectedClients={selectedClients}
        amountValue={amountFilter}
        onClearSearch={handleClearAll}
        searchableDropdown={true}
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