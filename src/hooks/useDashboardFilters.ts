import { useState, useEffect } from 'react';
import { AmountRange } from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';

export interface Client {
  id: number;
  name: string;
}

export interface UseDashboardFiltersOptions {
  initialAmountFilter?: AmountRange;
  enableClientFilter?: boolean;
  enableAmountFilter?: boolean;
  enableDateFilter?: boolean;
  chartType?: 'transactions' | 'sales' | 'revenue' | 'top-clients' | 'top-products' | 'top-categories' | 'transactions-failed' | 'top-municipalities';
}

export interface UseDashboardFiltersReturn {
  // Estados de filtros
  selectedClients: Client[];
  amountFilter: AmountRange;
  
  // Funciones de filtros
  handleAmountFilter: (amount: AmountRange) => void;
  handleClientFilter: (clientId: number) => void;
  handleDateRangeChange: (start: string, end: string) => void;
  handleClearFilters: () => void;
  handleResetFilters: () => void;
  
  // Datos para filtros
  clients: Client[];
  customers: any[];
  
  // Estados del store
  reportsFilters: any;
  setReportsFilters: (filters: any) => void;
  setReportsCurrentPage: (page: number) => void;
}

export const useDashboardFilters = (
  options: UseDashboardFiltersOptions = {}
): UseDashboardFiltersReturn => {
  const {
    initialAmountFilter = { min: '', max: '' },
    enableClientFilter = true,
    enableAmountFilter = true,
    enableDateFilter = true,
    chartType = 'transactions',
  } = options;

  // Store hooks
  const {
    reportsFilters,
    failedReportsFilters,
    uniqueClients,
    uniqueFailedClients,
    customersList,
    setReportsFilters,
    setFailedReportsFilters,
    setReportsCurrentPage,
    setFailedReportsCurrentPage,
    clearReportsFilters,
    clearFailedReportsFilters,
  } = useStore();

  // Estados locales
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>(initialAmountFilter);

  // Determinar qué filtros usar según el tipo de chart
  const getFiltersForChartType = () => {
    if (chartType === 'transactions-failed') {
      return {
        filters: failedReportsFilters,
        setFilters: setFailedReportsFilters,
        setCurrentPage: setFailedReportsCurrentPage,
        clearFilters: clearFailedReportsFilters,
        uniqueClients: uniqueFailedClients,
      };
    }
    return {
      filters: reportsFilters,
      setFilters: setReportsFilters,
      setCurrentPage: setReportsCurrentPage,
      clearFilters: clearReportsFilters,
      uniqueClients,
    };
  };

  const { filters, setFilters, setCurrentPage, clearFilters, uniqueClients: clientsList } = getFiltersForChartType();

  // Sincronizar el estado local del filtro de monto con los filtros del store
  useEffect(() => {
    if (enableAmountFilter) {
      setAmountFilter({
        min: filters.total_min?.toString() || '',
        max: filters.total_max?.toString() || '',
      });
    }
  }, [filters.total_min, filters.total_max, enableAmountFilter]);

  // Convertir clientes únicos del store al formato Client[]
  const clients: Client[] = clientsList.map((clientName, index) => ({
    id: index + 1,
    name: clientName,
  }));

  // Función para manejar filtro de monto
  const handleAmountFilter = (amount: AmountRange) => {
    if (!enableAmountFilter) return;
    
    setAmountFilter(amount);
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    setFilters({ total_min, total_max });
  };

  // Función para manejar filtro de cliente
  const handleClientFilter = (clientId: number) => {
    if (!enableClientFilter) return;
    
    if (clientId === -1 || clientId === 0) {
      setSelectedClients([]);
      setFilters({ selectedClient: undefined });
    } else {
      const customer = customersList.find((c) => c.id === clientId);
      if (customer) {
        setSelectedClients([{ id: customer.id, name: customer.customer }]);
        setFilters({ selectedClient: customer.customer });
      }
    }
  };

  // Función para manejar cambio de rango de fechas
  const handleDateRangeChange = (start: string, end: string) => {
    if (!enableDateFilter) return;
    setFilters({ start, end });
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setSelectedClients([]);
    setAmountFilter({ min: '', max: '' });
    setCurrentPage(1);
    setFilters({
      start: '',
      end: '',
      selectedClient: undefined,
      selectedCategory: undefined,
      type: null,
      total_min: undefined,
      total_max: undefined,
    });
  };

  // Función para resetear filtros
  const handleResetFilters = () => {
    handleClearFilters();
    clearFilters();
  };

  return {
    // Estados de filtros
    selectedClients,
    amountFilter,
    
    // Funciones de filtros
    handleAmountFilter,
    handleClientFilter,
    handleDateRangeChange,
    handleClearFilters,
    handleResetFilters,
    
    // Datos para filtros
    clients,
    customers: customersList,
    
    // Estados del store
    reportsFilters: filters,
    setReportsFilters: setFilters,
    setReportsCurrentPage: setCurrentPage,
  };
}; 