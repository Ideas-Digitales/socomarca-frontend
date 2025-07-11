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
import { TableDetail } from '@/stores/base/slices/reportsSlice';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';
import { formatCurrency } from '@/utils/formatCurrency';

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

export default function TransaccionesExitosas() {
  // Configuración de paginación
  const PER_PAGE = 10; // Configurable desde aquí

  // Store hooks
  const {
    transactionsList,
    reportsPagination,
    reportsFilters,
    isLoadingReports,
    uniqueClients, // Obtener clientes únicos del store (ahora viene del backend)
    fetchTransactionsList,
    setReportsCurrentPage,
    setReportsFilters,
    // Chart reports
    chartReportsData,
    isLoadingChartReports,
    fetchChartReports,
    clearChartReports,
    // Chart raw data
    fetchChartRawData,
    // Transaction details
    transactionDetails,
    fetchTransactionDetails,
    clearTransactionDetails,
    // Customers
    customersList,
    fetchCustomers,
    clearReportsFilters,
  } = useStore();

  // Estados para el overlay deslizante
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: reportsFilters.total_min?.toString() || '',
    max: reportsFilters.total_max?.toString() || '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sincronizar el estado local del filtro de monto con los filtros del store
  useEffect(() => {
    setAmountFilter({
      min: reportsFilters.total_min?.toString() || '',
      max: reportsFilters.total_max?.toString() || '',
    });
  }, [reportsFilters.total_min, reportsFilters.total_max]);

  // Convertir clientes únicos del store al formato Client[]
  const clients: Client[] = uniqueClients.map((clientName, index) => ({
    id: index + 1, // Usar índice como ID temporal
    name: clientName,
  }));

  // Cargar datos iniciales
  useEffect(() => {
    clearReportsFilters();
    const start = '';
    const end = '';
    const total_min = undefined;
    const total_max = undefined;
    Promise.all([
      fetchTransactionsList(start, end, 1, PER_PAGE, undefined, total_min, total_max),
      fetchChartReports(start, end, 'transactions'),
      fetchChartRawData(start, end, null),
      fetchCustomers()
    ]).finally(() => {
      setIsInitialLoad(false);
    });

    // Cleanup: limpiar datos cuando el componente se desmonta
    return () => {
      clearChartReports();
    };
  }, [fetchTransactionsList, fetchChartReports, fetchCustomers, PER_PAGE, clearReportsFilters, clearChartReports, fetchChartRawData]);



  // Simplificar - ya no necesitamos filtrado local, todo se hace en el backend
  // Transformar datos para la tabla directamente desde transactionsList
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

  // Debug: Log de datos cuando cambien
  useEffect(() => {
    console.log('transactionsList actualizada:', transactionsList);
    console.log('transaccionesFixed:', transaccionesFixed);
    console.log('isLoadingReports:', isLoadingReports);
    console.log('chartReportsData:', chartReportsData);
    console.log('isLoadingChartReports:', isLoadingChartReports);
    console.log('chartRawData:', useStore.getState().chartRawData);
  }, [transactionsList, transaccionesFixed, isLoadingReports, chartReportsData, isLoadingChartReports]);

  // Definir las métricas basadas en datos del backend
  const metrics: MetricCard[] = [
    {
      label: 'Transacciones exitosas',
      value: reportsPagination?.total || transaccionesFixed.length,
      color: 'lime',
    },
    {
      label: 'Valor total procesado',
      value: (() => {
        // Si tenemos datos de gráficos, usar esos para un cálculo más preciso
        if (chartReportsData?.totals && Array.isArray(chartReportsData.totals) && chartReportsData.totals.length > 0) {
          const totalFromCharts = chartReportsData.totals.reduce((sum, monthData) => {
            if (monthData?.sales_by_client && Array.isArray(monthData.sales_by_client)) {
              return sum + monthData.sales_by_client.reduce((monthSum, clientData) => {
                return monthSum + (clientData?.total || 0);
              }, 0);
            }
            return sum;
          }, 0);
          return formatCurrency(totalFromCharts);
        }
        // Fallback a los datos de la tabla actual
        return formatCurrency(transaccionesFixed.reduce((sum, t) => sum + t.monto1, 0));
      })(),
      color: 'gray',
    },
  ];

  // Configuración de gráficos - solo mostrar si hay datos disponibles
  const chartConfig: ChartConfig = {
    showMetricsChart: chartReportsData !== null,
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
    const { start, end, selectedClient, total_min, total_max } = reportsFilters;
    setReportsCurrentPage(page);
    fetchTransactionsList(start, end, page, PER_PAGE, selectedClient, total_min, total_max);
  };

  // Definir columnas para transacciones
  const transaccionesColumns: TableColumn<TransaccionFormateada>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto1',
      label: 'Monto',
      render: (value: number) => formatCurrency(value),
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
    setReportsFilters({ total_min, total_max });
  };

  const handleClientFilter = (clientId: number) => {
    console.log('handleClientFilter - clientId recibido:', clientId);
    
    if (clientId === -1 || clientId === 0) {
      // Limpiar filtro de cliente
      setSelectedClients([]);
      setReportsFilters({ selectedClient: undefined });
      console.log('handleClientFilter - limpiando cliente');
    } else {
      const customer = customersList.find((c) => c.id === clientId);
      console.log('handleClientFilter - customer encontrado:', customer);
      if (customer) {
        setSelectedClients([{ id: customer.id, name: customer.customer }]);
        // Establecer filtro por cliente en el store
        setReportsFilters({ selectedClient: customer.customer });
        console.log('handleClientFilter - cliente establecido:', customer.customer);
      }
    }
  };

  const handleFilter = () => {
    // Aplicar filtros ya configurados
    const { start, end, selectedClient, total_min, total_max } = reportsFilters;
    console.log('handleFilter - filtros actuales:', { start, end, selectedClient, total_min, total_max });
    console.log('handleFilter - selectedClients state:', selectedClients);
    setReportsCurrentPage(1);
    // Hacer la petición con todos los filtros configurados
    Promise.all([
      fetchTransactionsList(start, end, 1, PER_PAGE, selectedClient, total_min, total_max),
      fetchChartReports(start, end, 'transactions'),
      fetchChartRawData(start, end, selectedClient || null)
    ]);
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setReportsCurrentPage(1);
    setReportsFilters({ start: '', end: '', selectedClient: undefined, selectedCategory: undefined, type: null, total_min: undefined, total_max: undefined });
    
    // TEMPORAL: Limpiar también el input de cliente (se maneja en FilterOptions)
    
    // Limpiar tanto datos de transacciones como de gráficos y recargar
    clearChartReports();
    Promise.all([
      fetchTransactionsList('', '', 1, PER_PAGE, null, undefined, undefined),
      fetchChartReports('', '', 'transactions'),
      fetchChartRawData('', '', null)
    ]);
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    // Solo actualizar filtros en el store, no hacer petición automáticamente
    setReportsFilters({ start, end });
  };



  // Mostrar loading spinner completo solo en la carga inicial
  if ((isLoadingReports || isLoadingChartReports) && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando transacciones y gráficos...</p>
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
        customers={customersList}
        selectedClients={selectedClients}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: reportsFilters.start || undefined,
          end: reportsFilters.end || undefined,
        }}
      />

      {/* Loading overlay sutil para cambios de página/filtros */}
      {(isLoadingReports || isLoadingChartReports) && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">
              {isLoadingReports && isLoadingChartReports ? 'Actualizando datos y gráficos...' :
               isLoadingReports ? 'Actualizando datos...' : 'Actualizando gráficos...'}
            </span>
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
