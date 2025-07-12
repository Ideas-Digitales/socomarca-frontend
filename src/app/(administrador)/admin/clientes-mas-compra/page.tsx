'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
} from '@/interfaces/dashboard.interface';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ClientesMasCompra() {
  const PER_PAGE = 10;
  const {
    clientsMostPurchasesList,
    clientsMostPurchasesPagination,
    isLoadingClientsMostPurchases,
    clientsMostPurchasesFilters,
    fetchClientsMostPurchasesList,
    setClientsMostPurchasesFilters,
    setClientsMostPurchasesCurrentPage,
    clearClientsMostPurchasesFilters,
    // Chart loading
    isLoadingChart,
  } = useStore();

  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: clientsMostPurchasesFilters.total_min?.toString() || '',
    max: clientsMostPurchasesFilters.total_max?.toString() || '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setAmountFilter({
      min: clientsMostPurchasesFilters.total_min?.toString() || '',
      max: clientsMostPurchasesFilters.total_max?.toString() || '',
    });
  }, [clientsMostPurchasesFilters.total_min, clientsMostPurchasesFilters.total_max]);

  // Limpiar filtros al montar
  useEffect(() => {
    clearClientsMostPurchasesFilters();
    fetchClientsMostPurchasesList('', '', PER_PAGE, 1).finally(() => setIsInitialLoad(false));
  }, [fetchClientsMostPurchasesList, clearClientsMostPurchasesFilters, PER_PAGE]);

  // Transformar datos para la tabla
  const clientesFixed = clientsMostPurchasesList.map((item: any) => ({
    id: String(item.id),
    cliente: item.customer || '',
    monto: Number(item.amount) || 0,
    fecha: item.date || '',
    estado: item.status || '',
    municipio: item.municipality_name || '',
    region: item.region_name || '',
    acciones: item.acciones || '',
  }));

  // Calcular total de compras para métricas
  const totalCompras = clientesFixed.reduce((sum, cliente) => sum + (cliente.monto || 0), 0);

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Clientes con más compras',
      value: clientesFixed.length,
      color: 'lime',
    },
    {
      label: 'Valor total en compras',
      value: formatCurrency(totalCompras || 0),
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
    title: 'Clientes con más compras',
    showTable: true,
    tableTitle: 'Clientes con más compras',
    showDatePicker: true,
  };

  // Columnas específicas para clientes
  const clientesColumns: TableColumn<any>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'monto', label: 'Monto', render: (value: number) => formatCurrency(value || 0) },
    { key: 'fecha', label: 'Fecha' },
    { key: 'acciones', label: 'Acciones', render: (value: string) => <div className="text-lime-500">{value}</div> },
  ];

  // Handlers para los filtros
  const handleAmountFilter = (amount: AmountRange) => {
    setAmountFilter(amount);
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    setClientsMostPurchasesFilters({ ...clientsMostPurchasesFilters, total_min, total_max });
  };

  const handleFilter = () => {
    const { start, end, total_min, total_max } = clientsMostPurchasesFilters;
    setClientsMostPurchasesCurrentPage(1);
    fetchClientsMostPurchasesList(start || '', end || '', PER_PAGE, 1, total_min, total_max);
  };

  const handleClearSearch = () => {
    setAmountFilter({ min: '', max: '' });
    setClientsMostPurchasesCurrentPage(1);
    clearClientsMostPurchasesFilters();
    fetchClientsMostPurchasesList('', '', PER_PAGE, 1);
  };

  const handlePageChange = (page: number) => {
    const { start, end, total_min, total_max } = clientsMostPurchasesFilters;
    setClientsMostPurchasesCurrentPage(page);
    fetchClientsMostPurchasesList(start || '', end || '', PER_PAGE, page, total_min, total_max);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setClientsMostPurchasesFilters({ ...clientsMostPurchasesFilters, start, end });
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if ((isLoadingClientsMostPurchases || isLoadingChart) && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando clientes con más compras y gráficos...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <DashboardTableLayout
        config={config}
        tableData={clientesFixed}
        tableColumns={clientesColumns}
        productPaginationMeta={clientsMostPurchasesPagination || undefined}
        onPageChange={handlePageChange}
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        onFilter={handleFilter}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={false}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: clientsMostPurchasesFilters.start || undefined,
          end: clientsMostPurchasesFilters.end || undefined,
        }}
        isLoadingChart={isLoadingChart}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {(isLoadingClientsMostPurchases || isLoadingChart) && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">
              {isLoadingClientsMostPurchases && isLoadingChart ? 'Actualizando datos y gráficos...' :
               isLoadingClientsMostPurchases ? 'Actualizando datos...' : 'Actualizando gráficos...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
