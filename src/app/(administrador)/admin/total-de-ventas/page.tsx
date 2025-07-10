'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  AmountRange,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';
import { TableDetail } from '@/stores/base/slices/reportsSlice';

export interface Client {
  id: number;
  name: string;
}

export default function TotalDeVentas() {
  // Configuración de paginación
  const PER_PAGE = 10;

  // Store hooks
  const {
    transactionsList,
    reportsPagination,
    reportsFilters,
    isLoadingReports,
    uniqueClients,
    fetchTransactionsList,
    setReportsCurrentPage,
    setReportsFilters,
    clearReportsFilters,
    // Customers
    customersList,
    isLoadingCustomers,
    fetchCustomers,
  } = useStore();

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: reportsFilters.total_min?.toString() || '',
    max: reportsFilters.total_max?.toString() || '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sincronizar el estado local del filtro de monto con los filtros del store
  useEffect(() => {
    setAmountFilter({
      min: reportsFilters.total_min?.toString() || '',
      max: reportsFilters.total_max?.toString() || '',
    });
  }, [reportsFilters.total_min, reportsFilters.total_max]);

  // Convertir clientes únicos del store al formato Client[] (para compatibilidad)
  const clients: Client[] = uniqueClients.map((clientName, index) => ({
    id: index + 1,
    name: clientName,
  }));

  // Cargar datos iniciales y customers
  useEffect(() => {
    clearReportsFilters();
    const start = '';
    const end = '';
    const total_min = undefined;
    const total_max = undefined;
    Promise.all([
      fetchTransactionsList(start, end, 1, PER_PAGE, undefined, total_min, total_max),
      fetchCustomers()
    ]).finally(() => setIsInitialLoad(false));
  }, [fetchTransactionsList, fetchCustomers, PER_PAGE, clearReportsFilters]);

  // Transformar datos para la tabla
  let ventasFixed = transactionsList.map((venta: TableDetail) => ({
    id: String(venta.id),
    cliente: venta.customer,
    monto: venta.amount,
    fecha: venta.date,
    estado: venta.status,
    originalData: venta,
  }));

  // Ordenar de mayor a menor por monto
  ventasFixed = ventasFixed.sort((a, b) => b.monto - a.monto);

  // Definir columnas para la tabla
  const ventasColumns: TableColumn<any>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'monto', label: 'Monto', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ];

  // Definir métricas reales
  const metrics: MetricCard[] = [
    {
      label: 'Total de ventas',
      value: reportsPagination?.total || ventasFixed.length,
      color: 'lime',
    },
    {
      label: 'Monto total',
      value: `$${ventasFixed.reduce((sum, v) => sum + v.monto, 0).toLocaleString()}`,
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
    title: 'Total de ventas',
    showTable: true,
    tableTitle: 'Total de ventas',
    showDatePicker: true,
  };

  const handleAmountFilter = (amount: AmountRange) => {
    setAmountFilter(amount);
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    setReportsFilters({ total_min, total_max });
  };

  const handleClientFilter = (clientId: number) => {
    if (clientId === -1 || clientId === 0) {
      setSelectedClients([]);
      setReportsFilters({ selectedClient: undefined });
    } else {
      const customer = customersList.find((c) => c.id === clientId);
      if (customer) {
        setSelectedClients([{ id: customer.id, name: customer.customer }]);
        setReportsFilters({ selectedClient: customer.customer });
      }
    }
  };

  const handleFilter = () => {
    const { start, end, selectedClient, total_min, total_max } = reportsFilters;
    setReportsCurrentPage(1);
    fetchTransactionsList(start, end, 1, PER_PAGE, selectedClient, total_min, total_max);
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setReportsCurrentPage(1);
    setReportsFilters({ start: '', end: '', selectedClient: undefined, selectedCategory: undefined, type: null, total_min: undefined, total_max: undefined });
    fetchTransactionsList('', '', 1, PER_PAGE, null, undefined, undefined);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setReportsFilters({ start, end });
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={ventasFixed}
      tableColumns={ventasColumns}
      productPaginationMeta={reportsPagination || undefined}
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
  );
}
