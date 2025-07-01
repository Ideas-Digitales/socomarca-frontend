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
import { TableDetail } from '@/stores/base/slices/reportsSlice';
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
  originalData?: TableDetail;
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

export default function TransaccionesExitosas() {
  // Configuración de paginación
  const PER_PAGE = 10; // Configurable desde aquí

  // Store hooks
  const {
    transactionsList,
    // selectedTransaction, // Comentado temporalmente
    reportsPagination,
    reportsFilters,
    isLoadingReports,
    fetchTransactionsList,
    setReportsCurrentPage,
    setReportsFilters,
    // setSelectedTransaction, // Comentado temporalmente
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

  // Cargar datos iniciales
  useEffect(() => {
    // Usar fechas por defecto si no hay filtros
    const start = reportsFilters.start || '';
    const end = reportsFilters.end || '';
    console.log('🔄 Carga inicial con fechas:', { start, end });
    fetchTransactionsList(start, end, 1, PER_PAGE).finally(() => {
      setIsInitialLoad(false); // Marcar que ya no es la primera carga
    });
  }, [fetchTransactionsList, PER_PAGE]);

  // Log para verificar datos de paginación y estados
  useEffect(() => {
    console.log('Estados actuales:', {
      isLoadingReports,
      isInitialLoad,
      transactionsListLength: transactionsList.length,
      paginationTotal: reportsPagination?.total,
      currentPage: reportsPagination?.current_page
    });
    
    if (reportsPagination) {
      console.log('Paginación recibida:', {
        total: reportsPagination.total,
        current_page: reportsPagination.current_page,
        last_page: reportsPagination.last_page,
        from: reportsPagination.from,
        to: reportsPagination.to
      });
    }
  }, [reportsPagination, isLoadingReports, isInitialLoad, transactionsList]);

  // Transformar datos para la tabla
  const transaccionesFixed: TransaccionFormateada[] = transactionsList.map(
    (transaction: TableDetail) => ({
      id: String(transaction.id),
      cliente: transaction.customer,
      monto1: transaction.amount,
      monto2: transaction.amount,
      monto3: transaction.amount,
      fecha: transaction.date,
      acciones: 'Ver detalles',
      originalData: transaction,
    })
  );

  // Definir las métricas basadas en datos del store
  const metrics: MetricCard[] = [
    {
      label: 'Transacciones exitosas',
      value: reportsPagination?.total || transaccionesFixed.length,
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

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = {
    title: 'Transacciones Exitosas',
    showTable: true,
    tableTitle: 'Lista de Transacciones Exitosas',
    showDatePicker: true,
  };

  // Función para abrir el overlay con detalles
  const handleViewDetails = (transaccion: TransaccionFormateada) => {
    // Temporalmente mostrar alerta en lugar del overlay 
    // hasta tener endpoint de detalles de transacción
    if (transaccion.originalData) {
      alert(`Detalles de la transacción:
ID: ${transaccion.originalData.id}
Cliente: ${transaccion.originalData.customer}
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
      setSelectedTransaction(null);
    }, 300);
  };
  */

  // Función para manejar cambio de página
  const handlePageChange = (page: number) => {
    const start = reportsFilters.start || '';
    const end = reportsFilters.end || '';
    console.log('🔄 Cambiando a página:', page, {
      start,
      end,
      PER_PAGE,
      currentDataLength: transactionsList.length
    });
    setReportsCurrentPage(page);
    fetchTransactionsList(start, end, page, PER_PAGE);
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
      key: 'monto2',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'monto3',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: 'fecha', label: 'Fecha' },
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
    // Para simplicidad, solo filtraremos por fechas
    const start = reportsFilters.start || '';
    const end = reportsFilters.end || '';
    fetchTransactionsList(start, end, 1, PER_PAGE);
  };

  const handleClientFilter = (clientId: number) => {
    if (clientId === -1 || clientId === 0) {
      setSelectedClients([]);
    } else {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClients([client]);
      }
    }
    // Para simplicidad, solo filtraremos por fechas
    const start = reportsFilters.start || '';
    const end = reportsFilters.end || '';
    fetchTransactionsList(start, end, 1, PER_PAGE);
  };

  const handleFilter = () => {
    // Aplicar filtros ya configurados
    const start = reportsFilters.start || '';
    const end = reportsFilters.end || '';
    fetchTransactionsList(start, end, 1, PER_PAGE);
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setReportsFilters({ start: '', end: '' });
    fetchTransactionsList('', '', 1, PER_PAGE);
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if (isLoadingReports && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando transacciones...</p>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay datos (solo si no es carga inicial y no está cargando)
  if (!isLoadingReports && !isInitialLoad && transaccionesFixed.length === 0 && reportsPagination?.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay transacciones</h3>
        <p className="text-gray-600 text-sm">No se encontraron transacciones con los filtros actuales.</p>
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
        productPaginationMeta={reportsPagination || undefined}
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
      />

      {/* Loading overlay sutil para cambios de página/filtros */}
      {isLoadingReports && !isInitialLoad && (
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
        detailSelected={selectedTransaction}
        onClose={handleCloseOverlay}
      /> */}
    </div>
  );
}
