import { useState, useEffect } from 'react';
import useStore from '@/stores/base';

export interface UseDashboardDataOptions {
  perPage?: number;
  enableChartData?: boolean;
  enableCustomers?: boolean;
  chartType?: 'transactions' | 'sales' | 'revenue' | 'top-clients' | 'top-products' | 'top-categories' | 'transactions-failed' | 'top-municipalities';
}

export interface UseDashboardDataReturn {
  // Estados de loading
  isLoadingReports: boolean;
  isLoadingChart: boolean;
  isLoadingChartReports: boolean;
  isInitialLoad: boolean;
  
  // Funciones de carga
  handleFilter: () => void;
  handlePageChange: (page: number) => void;
  handleClearSearch: () => void;
  
  // Datos
  transactionsList: any[];
  reportsPagination: any;
  chartReportsData: any;
  
  // Funciones del store
  fetchTransactionsList: any;
  fetchChartRawData: any;
  fetchChartReports: any;
  fetchCustomers: any;
}

/**
 * Hook personalizado para manejar la carga de datos en dashboards
 * Sigue el principio de responsabilidad única (SRP)
 */
export const useDashboardData = (
  options: UseDashboardDataOptions = {}
): UseDashboardDataReturn => {
  const {
    perPage = 10,
    enableChartData = true,
    enableCustomers = true,
    chartType = 'transactions',
  } = options;

  // Store hooks
  const {
    transactionsList,
    failedTransactionsList,
    reportsPagination,
    failedReportsPagination,
    isLoadingReports,
    isLoadingFailedReports,
    isLoadingChart,
    isLoadingChartReports,
    chartReportsData,
    fetchTransactionsList,
    fetchFailedTransactionsList,
    fetchChartRawData,
    fetchChartReports,
    fetchCustomers,
    clearReportsFilters,
    clearFailedReportsFilters,
  } = useStore();

  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    if (chartType === 'transactions-failed') {
      clearFailedReportsFilters();
    } else {
      clearReportsFilters();
    }
    const start = '';
    const end = '';
    const total_min = undefined;
    const total_max = undefined;

    const loadInitialData = async () => {
      const promises: Promise<any>[] = [];

      // Cargar datos según el tipo de chart
      if (chartType === 'top-municipalities' || chartType === 'top-products' || chartType === 'top-categories') {
        // Para municipalidades, productos y categorías, usar fetchChartReports
        promises.push(fetchChartReports(start, end, chartType, total_min, total_max));
        if (enableChartData) {
          promises.push(fetchChartRawData(start, end, null));
        }
      } else if (chartType === 'transactions-failed') {
        // Para transacciones fallidas, usar fetchFailedTransactionsList
        promises.push(fetchFailedTransactionsList(start, end, 1, perPage, undefined, total_min, total_max));
        if (enableChartData) {
          promises.push(fetchChartRawData(start, end, null));
          promises.push(fetchChartReports(start, end, chartType));
        }
      } else {
        // Para otros tipos, usar fetchTransactionsList
        promises.push(fetchTransactionsList(start, end, 1, perPage, undefined, total_min, total_max));
        if (enableChartData) {
          promises.push(fetchChartRawData(start, end, null));
          promises.push(fetchChartReports(start, end, chartType));
        }
      }

      if (enableCustomers) {
        promises.push(fetchCustomers());
      }

      await Promise.all(promises);
      setIsInitialLoad(false);
    };

    loadInitialData();

    // Cleanup al desmontar el componente
    return () => {
      if (chartType === 'transactions-failed') {
        clearFailedReportsFilters();
      } else {
        clearReportsFilters();
      }
    };
  }, [
    fetchTransactionsList,
    fetchFailedTransactionsList,
    fetchChartRawData,
    fetchChartReports,
    fetchCustomers,
    perPage,
    clearReportsFilters,
    clearFailedReportsFilters,
    enableChartData,
    enableCustomers,
    chartType,
  ]);

  // Función para aplicar filtros
  const handleFilter = () => {
    const filters = chartType === 'transactions-failed' 
      ? useStore.getState().failedReportsFilters 
      : useStore.getState().reportsFilters;
    const { start, end, selectedClient, total_min, total_max } = filters;
    
    if (chartType === 'transactions-failed') {
      useStore.getState().setFailedReportsCurrentPage(1);
    } else {
      useStore.getState().setReportsCurrentPage(1);
    }
    
    const promises: Promise<any>[] = [];

    // Cargar datos según el tipo de chart
    if (chartType === 'top-municipalities' || chartType === 'top-products' || chartType === 'top-categories') {
      // Para municipalidades, productos y categorías, usar fetchChartReports
      promises.push(fetchChartReports(start, end, chartType, total_min, total_max));
      if (enableChartData) {
        promises.push(fetchChartRawData(start, end, null));
      }
    } else if (chartType === 'transactions-failed') {
      // Para transacciones fallidas, usar fetchFailedTransactionsList
      promises.push(fetchFailedTransactionsList(start, end, 1, perPage, selectedClient, total_min, total_max));
      if (enableChartData) {
        promises.push(fetchChartRawData(start, end, selectedClient || null));
        promises.push(fetchChartReports(start, end, chartType));
      }
    } else {
      // Para otros tipos, usar fetchTransactionsList
      promises.push(fetchTransactionsList(start, end, 1, perPage, selectedClient, total_min, total_max));
      if (enableChartData) {
        promises.push(fetchChartRawData(start, end, selectedClient || null));
        promises.push(fetchChartReports(start, end, chartType));
      }
    }

    Promise.all(promises);
  };

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    const filters = chartType === 'transactions-failed' 
      ? useStore.getState().failedReportsFilters 
      : useStore.getState().reportsFilters;
    const { start, end, selectedClient, total_min, total_max } = filters;
    
    if (chartType === 'transactions-failed') {
      useStore.getState().setFailedReportsCurrentPage(page);
    } else {
      useStore.getState().setReportsCurrentPage(page);
    }
    
    // Para municipalidades, productos y categorías no hay paginación, solo recargar datos
    if (chartType === 'top-municipalities' || chartType === 'top-products' || chartType === 'top-categories') {
      fetchChartReports(start, end, chartType, total_min, total_max);
    } else if (chartType === 'transactions-failed') {
      fetchFailedTransactionsList(start, end, page, perPage, selectedClient, total_min, total_max);
    } else {
      fetchTransactionsList(start, end, page, perPage, selectedClient, total_min, total_max);
    }
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    if (chartType === 'transactions-failed') {
      useStore.getState().setFailedReportsCurrentPage(1);
      useStore.getState().setFailedReportsFilters({
        start: '',
        end: '',
        selectedClient: undefined,
        selectedCategory: undefined,
        type: null,
        total_min: undefined,
        total_max: undefined,
      });
    } else {
      useStore.getState().setReportsCurrentPage(1);
      useStore.getState().setReportsFilters({
        start: '',
        end: '',
        selectedClient: undefined,
        selectedCategory: undefined,
        type: null,
        total_min: undefined,
        total_max: undefined,
      });
    }

    const promises: Promise<any>[] = [];

    // Cargar datos según el tipo de chart
    if (chartType === 'top-municipalities' || chartType === 'top-products' || chartType === 'top-categories') {
      // Para municipalidades, productos y categorías, usar fetchChartReports
      promises.push(fetchChartReports('', '', chartType, undefined, undefined));
      if (enableChartData) {
        promises.push(fetchChartRawData('', '', null));
      }
    } else if (chartType === 'transactions-failed') {
      // Para transacciones fallidas, usar fetchFailedTransactionsList
      promises.push(fetchFailedTransactionsList('', '', 1, perPage, null, undefined, undefined));
      if (enableChartData) {
        promises.push(fetchChartRawData('', '', null));
        promises.push(fetchChartReports('', '', chartType));
      }
    } else {
      // Para otros tipos, usar fetchTransactionsList
      promises.push(fetchTransactionsList('', '', 1, perPage, null, undefined, undefined));
      if (enableChartData) {
        promises.push(fetchChartRawData('', '', null));
        promises.push(fetchChartReports('', '', chartType));
      }
    }

    Promise.all(promises);
  };

  // Determinar qué datos retornar según el tipo de chart
  const getDataForChartType = () => {
    if (chartType === 'transactions-failed') {
      return {
        transactionsList: failedTransactionsList,
        reportsPagination: failedReportsPagination,
        isLoadingReports: isLoadingFailedReports,
      };
    }
    return {
      transactionsList,
      reportsPagination,
      isLoadingReports,
    };
  };

  const { transactionsList: dataList, reportsPagination: dataPagination, isLoadingReports: dataLoading } = getDataForChartType();

  return {
    // Estados de loading
    isLoadingReports: dataLoading,
    isLoadingChart,
    isLoadingChartReports,
    isInitialLoad,
    
    // Funciones de carga
    handleFilter,
    handlePageChange,
    handleClearSearch,
    
    // Datos
    transactionsList: dataList,
    reportsPagination: dataPagination,
    chartReportsData,
    
    // Funciones del store
    fetchTransactionsList,
    fetchChartRawData,
    fetchChartReports,
    fetchCustomers,
  };
}; 