'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import VerPedidoOverlay from '@/app/components/dashboardTable/VerPedidoOverlay';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
} from '@/interfaces/dashboard.interface';
import { FailedTransactionDetail } from '@/stores/base/slices/reportsSlice';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';

interface TransaccionFormateada {
  id: string;
  cliente: string;
  monto1: number;
  monto2: number;
  monto3: number;
  fecha: string;
  acciones: string;
  originalData?: FailedTransactionDetail;
}

export interface Client {
  id: number;
  name: string;
}

export default function TransaccionesFallidas() {
  // Configuración de paginación
  const PER_PAGE = 10;

  // Store hooks
  const {
    failedTransactionsList,
    failedReportsPagination,
    failedReportsFilters,
    isLoadingFailedReports,
    uniqueFailedClients, // Obtener clientes únicos del store (ahora viene del backend)
    fetchFailedTransactionsList,
    setFailedReportsCurrentPage,
    setFailedReportsFilters,
    clearFailedReportsFilters,
    // Transaction details
    transactionDetails,
    fetchTransactionDetails,
    clearTransactionDetails,
    // Customers
    customersList,
    fetchCustomers,
  } = useStore();

  // Estados para el overlay deslizante
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: failedReportsFilters.total_min?.toString() || '',
    max: failedReportsFilters.total_max?.toString() || '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sincronizar el estado local del filtro de monto con los filtros del store
  useEffect(() => {
    setAmountFilter({
      min: failedReportsFilters.total_min?.toString() || '',
      max: failedReportsFilters.total_max?.toString() || '',
    });
  }, [failedReportsFilters.total_min, failedReportsFilters.total_max]);

  // Convertir clientes únicos del store al formato Client[]
  const clients: Client[] = uniqueFailedClients.map((clientName, index) => ({
    id: index + 1, // Usar índice como ID temporal
    name: clientName,
  }));

  // Cargar datos iniciales
  useEffect(() => {
    clearFailedReportsFilters();
    
    // Usar fechas por defecto para obtener datos reales desde el inicio
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const start = startOfMonth.toISOString().split('T')[0]; // YYYY-MM-DD
    const end = endOfMonth.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const total_min = undefined;
    const total_max = undefined;
    
    Promise.all([
      fetchFailedTransactionsList(start, end, 1, PER_PAGE, undefined, total_min, total_max),
      fetchCustomers()
    ]).finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchFailedTransactionsList, fetchCustomers, PER_PAGE, clearFailedReportsFilters]);

  // Cleanup: limpiar datos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // No hay datos específicos que limpiar para transacciones fallidas
      // Los datos se manejan de forma independiente
    };
  }, []);

  // Transformar datos para la tabla directamente desde failedTransactionsList
  const transaccionesFixed: TransaccionFormateada[] = failedTransactionsList.map(
    (transaction: FailedTransactionDetail) => ({
      id: String(transaction.id),
      cliente: transaction.client,
      monto1: transaction.amount,
      monto2: transaction.amount,
      monto3: transaction.amount,
      fecha: transaction.date,
      acciones: 'Ver detalles',
      originalData: transaction,
    })
  );

  // Definir las métricas basadas en datos del backend
  const metrics: MetricCard[] = [
    {
      label: 'Transacciones fallidas',
      value: failedReportsPagination?.total || transaccionesFixed.length,
      color: 'lime',
    },
    {
      label: 'Valor total procesado',
      value: `$${transaccionesFixed.reduce((sum, t) => sum + t.monto1, 0).toLocaleString()}`,
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: false,
    metrics: metrics,
  };

  // Configuración del dashboard (usando ExtendedDashboardTableConfig)
  const config: ExtendedDashboardTableConfig = {
    title: 'Transacciones Fallidas',
    showTable: true,
    tableTitle: 'Lista de Transacciones Fallidas',
    showDatePicker: true,
  };

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

  // Función para manejar cambio de página - simplificada
  const handlePageChange = (page: number) => {
    const { start, end, selectedClient, total_min, total_max } = failedReportsFilters;
    setFailedReportsCurrentPage(page);
    fetchFailedTransactionsList(start, end, page, PER_PAGE, selectedClient, total_min, total_max);
  };

  // Definir columnas para transacciones fallidas
  const transaccionesColumns: TableColumn<TransaccionFormateada>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto1',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => value,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: string, row: TransaccionFormateada) => (
        <div
          onClick={() => handleViewDetails(row)}
          className="text-lime-500 cursor-pointer hover:text-lime-600 transition-colors"
        >
          {value}
        </div>
      ),
    },
  ];

  const handleAmountFilter = (amount: AmountRange) => {
    setAmountFilter(amount);
    // Convertir los valores de string a number para el backend
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    
    // Solo actualizar filtros en el store, no hacer petición automáticamente
    setFailedReportsFilters({ total_min, total_max });
  };

  const handleClientFilter = (clientId: number) => {
    console.log('handleClientFilter - clientId recibido:', clientId);
    
    if (clientId === -1 || clientId === 0) {
      // Limpiar filtro de cliente
      setSelectedClients([]);
      setFailedReportsFilters({ selectedClient: undefined });
      console.log('handleClientFilter - limpiando cliente');
    } else {
      const customer = customersList.find((c) => c.id === clientId);
      console.log('handleClientFilter - customer encontrado:', customer);
      if (customer) {
        setSelectedClients([{ id: customer.id, name: customer.customer }]);
        // Establecer filtro por cliente en el store
        setFailedReportsFilters({ selectedClient: customer.customer });
        console.log('handleClientFilter - cliente establecido:', customer.customer);
      }
    }
  };

  const handleFilter = () => {
    // Aplicar filtros ya configurados
    const { start, end, selectedClient, total_min, total_max } = failedReportsFilters;
    console.log('handleFilter - filtros actuales:', { start, end, selectedClient, total_min, total_max });
    console.log('handleFilter - selectedClients state:', selectedClients);
    setFailedReportsCurrentPage(1);
    
    // Hacer la petición con todos los filtros configurados
    fetchFailedTransactionsList(start, end, 1, PER_PAGE, selectedClient, total_min, total_max);
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setFailedReportsCurrentPage(1);
    
    // Usar fechas por defecto en lugar de fechas vacías
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const start = startOfMonth.toISOString().split('T')[0];
    const end = endOfMonth.toISOString().split('T')[0];
    
    setFailedReportsFilters({ start, end, selectedClient: undefined, selectedCategory: undefined, type: null, total_min: undefined, total_max: undefined });
    
    // Limpiar datos y recargar
    fetchFailedTransactionsList(start, end, 1, PER_PAGE, null, undefined, undefined);
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    // Solo actualizar filtros en el store, no hacer petición automáticamente
    setFailedReportsFilters({ start, end });
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if (isLoadingFailedReports && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando transacciones fallidas...</p>
      </div>
    );
  }



  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={transaccionesFixed}
        tableColumns={transaccionesColumns}
        productPaginationMeta={failedReportsPagination || undefined}
        onPageChange={handlePageChange}
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        onClientFilter={handleClientFilter}
        onFilter={handleFilter}
        clients={clients}
        customers={customersList}
        selectedClients={selectedClients}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: failedReportsFilters.start || undefined,
          end: failedReportsFilters.end || undefined,
        }}
      />

      {/* Loading overlay sutil para cambios de página/filtros */}
      {isLoadingFailedReports && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">Actualizando datos...</span>
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
