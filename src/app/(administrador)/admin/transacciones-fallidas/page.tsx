'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import VerPedidoOverlay from '@/app/components/dashboardTable/VerPedidoOverlay';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useFailedTransactionsDashboard } from '@/hooks/useDashboardMaster';
import { useState } from 'react';
import useStore from '@/stores/base';

interface TransaccionFormateada {
  id: string;
  cliente: string;
  monto1: number;
  monto2: number;
  monto3: number;
  fecha: string;
  acciones: string;
  originalData?: any;
}

export default function TransaccionesFallidas() {
  // Estados para el overlay deslizante
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const {
    transactionDetails,
    fetchTransactionDetails,
    clearTransactionDetails,
  } = useStore();

  // Hook maestro para dashboard de transacciones fallidas
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
    tableData: transaccionesFixed,
    tableColumns: transaccionesColumns,

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
  } = useFailedTransactionsDashboard(
    'Transacciones Fallidas',
    'Lista de Transacciones Fallidas',
    {
      initialMessage: 'Cargando transacciones fallidas...',
      overlayMessage: 'Actualizando transacciones fallidas...',
    }
  );

  // Función para abrir el overlay con detalles
  const handleViewDetails = async (transaccion: TransaccionFormateada) => {
    if (transaccion.originalData) {
      setIsOverlayOpen(true);
      // Limpiar detalles anteriores
      clearTransactionDetails();
      // Cargar detalles de la transacción
      await fetchTransactionDetails(transaccion.originalData.id);
    }
  };

  // Función para cerrar el overlay
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Pequeño delay para la animación antes de limpiar los datos
    setTimeout(() => {
      clearTransactionDetails();
    }, 300);
  };

  // Actualizar las columnas para incluir la función handleViewDetails
  const transaccionesColumnsWithActions = transaccionesColumns.map((column) => {
    if (column.key === 'acciones') {
      return {
        ...column,
        render: (value: string, row: any) => (
          <div
            onClick={() => handleViewDetails(row)}
            className="text-lime-500 cursor-pointer hover:text-lime-600 transition-colors"
          >
            {value}
          </div>
        ),
      };
    }
    return column;
  });

  // Mostrar loading spinner completo solo en la carga inicial
  if (showInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">
          Cargando transacciones fallidas...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={transaccionesFixed}
        tableColumns={transaccionesColumnsWithActions}
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

      {/* Overlay deslizante */}
      <VerPedidoOverlay
        isOpen={isOverlayOpen}
        detailSelected={transactionDetails}
        onClose={handleCloseOverlay}
      />
    </div>
  );
}
