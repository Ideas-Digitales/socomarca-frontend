'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { CategoriasMasVentasSkeleton } from '@/app/components/admin/DashboardSkeletonConfigs';
import { useCategoriesDashboard } from '@/hooks/useDashboardMaster';

export default function CategoriasMasVentas() {
  // Hook maestro para dashboard de categorías con más ventas
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
    tableData: categoriasFixed,
    tableColumns: categoriasColumns,

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
  } = useCategoriesDashboard('Categorías con más ventas', 'Categorías con más ventas', {
    initialMessage: 'Cargando categorías con más ventas...',
    overlayMessage: 'Actualizando categorías...',
  });

  // Mostrar skeleton completo solo en la carga inicial
  if (showInitialLoading) {
    return <CategoriasMasVentasSkeleton />;
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={categoriasFixed}
        tableColumns={categoriasColumns}
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