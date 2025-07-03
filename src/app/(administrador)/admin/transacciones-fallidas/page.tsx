'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
// import VerPedidoOverlay from '@/app/components/dashboardTable/VerPedidoOverlay';
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

const clients: Client[] = [
  { id: 1, name: 'Cliente 1' },
  { id: 2, name: 'Cliente 2' },
  { id: 3, name: 'Cliente 3' },
  { id: 4, name: 'Cliente 4' },
];

export default function TransaccionesFallidas() {
  // Configuración de paginación
  const PER_PAGE = 10; // Configurable desde aquí

  // Store hooks
  const {
    failedTransactionsList,
    // selectedFailedTransaction, // Comentado temporalmente
    failedReportsPagination,
    failedReportsFilters,
    isLoadingFailedReports,
    uniqueFailedClients, // Obtener clientes únicos del store (ahora viene del backend)
    fetchFailedTransactionsList,
    setFailedReportsCurrentPage,
    setFailedReportsFilters,
    // setSelectedFailedTransaction, // Comentado temporalmente
  } = useStore();

  // Estados para el overlay deslizante - Comentado temporalmente
  // const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Convertir clientes únicos del store al formato Client[]
  const clients: Client[] = uniqueFailedClients.map((clientName, index) => ({
    id: index + 1, // Usar índice como ID temporal
    name: clientName,
  }));

  // Cargar datos iniciales
  useEffect(() => {
    // Usar fechas por defecto si no hay filtros
    const start = failedReportsFilters.start || '';
    const end = failedReportsFilters.end || '';
    console.log('🔄 Carga inicial de transacciones fallidas con fechas:', { start, end });
    fetchFailedTransactionsList(start, end, 1, PER_PAGE).finally(() => {
      setIsInitialLoad(false); // Marcar que ya no es la primera carga
    });
  }, [fetchFailedTransactionsList, PER_PAGE]);

  // Log para verificar datos de paginación y estados
  useEffect(() => {
    console.log('Estados actuales transacciones fallidas:', {
      isLoadingFailedReports,
      isInitialLoad,
      failedTransactionsListLength: failedTransactionsList.length,
      paginationTotal: failedReportsPagination?.total,
      currentPage: failedReportsPagination?.current_page
    });
    
    if (failedReportsPagination) {
      console.log('Paginación recibida transacciones fallidas:', {
        total: failedReportsPagination.total,
        current_page: failedReportsPagination.current_page,
        last_page: failedReportsPagination.last_page,
        from: failedReportsPagination.from,
        to: failedReportsPagination.to
      });
    }
  }, [failedReportsPagination, isLoadingFailedReports, isInitialLoad, failedTransactionsList]);

  // Transformar datos para la tabla directamente desde failedTransactionsList
  const transaccionesFixed: TransaccionFormateada[] = failedTransactionsList.map(
    (transaction: FailedTransactionDetail) => ({
      id: String(transaction.id),
      cliente: transaction.client, // En transacciones fallidas se usa 'client' en lugar de 'customer'
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
      label: 'Transacciones Fallidas',
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
  const handleViewDetails = (transaccion: TransaccionFormateada) => {
    // Temporalmente mostrar alerta en lugar del overlay 
    // hasta tener endpoint de detalles de transacción
    if (transaccion.originalData) {
      alert(`Detalles de la transacción:
ID: ${transaccion.originalData.id}
Cliente: ${transaccion.originalData.client}
Monto: $${transaccion.originalData.amount.toLocaleString()}
Fecha: ${transaccion.originalData.date}
Estado: ${transaccion.originalData.status}`);
    }
  };

  // Función para cerrar el overlay - Comentado temporalmente
  /*
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Pequeño delay para la animación antes de limpiar los datos
    setTimeout(() => {
      setSelectedFailedTransaction(null);
    }, 300);
  };
  */

  // Función para manejar cambio de página - simplificada
  const handlePageChange = (page: number) => {
    const { start, end, selectedClient, selectedCategory, type } = failedReportsFilters;
    setFailedReportsCurrentPage(page);
    fetchFailedTransactionsList(start, end, page, PER_PAGE, selectedClient, selectedCategory, type);
  };

  // Definir columnas para transacciones
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
    // Nota: El filtro de montos se podría implementar en el backend si se requiere
    // Por ahora mantenemos la funcionalidad básica
    const { start, end, selectedClient, selectedCategory, type } = failedReportsFilters;
    setFailedReportsCurrentPage(1);
    fetchFailedTransactionsList(start, end, 1, PER_PAGE, selectedClient, selectedCategory, type);
  };

  const handleClientFilter = (clientId: number) => {
    // Resetear a la primera página cuando cambie el filtro
    setFailedReportsCurrentPage(1);
    
    if (clientId === -1 || clientId === 0) {
      // Limpiar filtro de cliente
      setSelectedClients([]);
      setFailedReportsFilters({ selectedClient: undefined });
      
      // Refetch con filtros actualizados
      const { start, end, selectedCategory, type } = failedReportsFilters;
      fetchFailedTransactionsList(start, end, 1, PER_PAGE, null, selectedCategory, type);
    } else {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClients([client]);
        // Establecer filtro por cliente en el store
        setFailedReportsFilters({ selectedClient: client.name });
        
        // Refetch con filtros actualizados
        const { start, end, selectedCategory, type } = failedReportsFilters;
        fetchFailedTransactionsList(start, end, 1, PER_PAGE, client.name, selectedCategory, type);
      }
    }
  };

  const handleFilter = () => {
    // Aplicar filtros ya configurados
    const { start, end, selectedClient, selectedCategory, type } = failedReportsFilters;
    setFailedReportsCurrentPage(1);
    fetchFailedTransactionsList(start, end, 1, PER_PAGE, selectedClient, selectedCategory, type);
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setFailedReportsCurrentPage(1);
    setFailedReportsFilters({ start: '', end: '', selectedClient: undefined, selectedCategory: undefined, type: null });
    fetchFailedTransactionsList('', '', 1, PER_PAGE, null, null, null);
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    console.log('📅 Cambio de fechas transacciones fallidas:', { start, end });
    const { selectedClient, selectedCategory, type } = failedReportsFilters;
    setFailedReportsFilters({ start, end });
    setFailedReportsCurrentPage(1);
    fetchFailedTransactionsList(start, end, 1, PER_PAGE, selectedClient, selectedCategory, type);
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

  // Mostrar mensaje cuando no hay datos (solo si no es carga inicial y no está cargando)
  if (!isLoadingFailedReports && !isInitialLoad && transaccionesFixed.length === 0 && failedReportsPagination?.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay transacciones fallidas</h3>
        <p className="text-gray-600 text-sm">No se encontraron transacciones fallidas con los filtros actuales.</p>
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

      {/* Overlay deslizante - Comentado temporalmente hasta tener endpoint de detalles */}
      {/* <VerPedidoOverlay
        isOpen={isOverlayOpen}
        detailSelected={selectedFailedTransaction}
        onClose={handleCloseOverlay}
      /> */}
    </div>
  );
}
