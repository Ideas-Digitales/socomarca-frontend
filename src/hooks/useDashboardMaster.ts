import { useDashboardFilters } from './useDashboardFilters';
import { useDashboardData } from './useDashboardData';
import { useTransactionsTable, useMunicipalitiesTable, useProductsTable, useCategoriesTable, useFailedTransactionsTable } from './useDashboardTable';
import { useTransactionsLoading } from './useDashboardLoading';

export interface UseDashboardMasterOptions {
  // Configuración general
  title: string;
  tableTitle: string;
  perPage?: number;
  
  // Configuración de filtros
  enableClientFilter?: boolean;
  enableAmountFilter?: boolean;
  enableDateFilter?: boolean;
  
  // Configuración de datos
  enableChartData?: boolean;
  enableCustomers?: boolean;
  chartType?: 'transactions' | 'sales' | 'revenue' | 'top-clients' | 'top-products' | 'top-categories' | 'transactions-failed' | 'top-municipalities';
  
  // Configuración de tabla
  showDatePicker?: boolean;
  enableCharts?: boolean;
  includeActions?: boolean;
  
  // Configuración de loading
  initialMessage?: string;
  overlayMessage?: string;
  showOverlay?: boolean;
}

export interface UseDashboardMasterReturn {
  // Estados de filtros
  selectedClients: any[];
  amountFilter: any;
  clients: any[];
  customers: any[];
  reportsFilters: any;
  
  // Estados de datos
  isLoadingReports: boolean;
  isLoadingChart: boolean;
  isInitialLoad: boolean;
  transactionsList: any[];
  reportsPagination: any;
  chartReportsData: any;
  
  // Estados de tabla
  config: any;
  chartConfig: any;
  tableData: any[];
  tableColumns: any[];
  
  // Estados de loading
  showInitialLoading: boolean;
  showOverlayLoading: boolean;
  loadingMessage: string;
  
  // Funciones de filtros
  handleAmountFilter: (amount: any) => void;
  handleClientFilter: (clientId: number) => void;
  handleDateRangeChange: (start: string, end: string) => void;
  handleClearFilters: () => void;
  handleResetFilters: () => void;
  
  // Funciones de datos
  handleFilter: () => void;
  handlePageChange: (page: number) => void;
  handleClearSearch: () => void;
  
  // Función combinada para limpiar todo
  handleClearAll: () => void;
}

/**
 * Hook maestro que combina todos los hooks de dashboard
 * Sigue el principio de responsabilidad única (SRP) - coordina otros hooks
 */
export const useDashboardMaster = (
  options: UseDashboardMasterOptions
): UseDashboardMasterReturn => {
  const {
    title,
    tableTitle,
    perPage = 10,
    enableClientFilter = true,
    enableAmountFilter = true,
    enableDateFilter = true,
    enableChartData = true,
    enableCustomers = true,
    chartType = 'transactions',
    showDatePicker = true,
    enableCharts = true,
    includeActions = false,
    initialMessage = 'Cargando datos...',
    overlayMessage = 'Actualizando datos...',
    showOverlay = true,
  } = options;

  // Hook de filtros
  const {
    selectedClients,
    amountFilter,
    handleAmountFilter,
    handleClientFilter,
    handleDateRangeChange,
    handleClearFilters,
    handleResetFilters,
    clients,
    customers,
    reportsFilters,
    setReportsCurrentPage,
  } = useDashboardFilters({
    enableClientFilter,
    enableAmountFilter,
    enableDateFilter,
    chartType,
  });

  // Hook de datos
  const {
    isLoadingReports,
    isLoadingChart,
    isInitialLoad,
    handleFilter,
    handlePageChange,
    handleClearSearch: handleClearSearchData,
    transactionsList,
    reportsPagination,
    chartReportsData,
  } = useDashboardData({
    perPage,
    enableChartData,
    enableCustomers,
    chartType,
  });

  // Hook de tabla para transacciones
  const transactionsTableResult = useTransactionsTable(transactionsList, {
    title,
    tableTitle,
    showDatePicker,
    enableCharts,
    chartReportsData,
    includeActions,
  });

  // Hook de tabla para municipalidades
  const municipalitiesTableResult = useMunicipalitiesTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    enableCharts,
  });

  // Hook de tabla para productos
  const productsTableResult = useProductsTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    enableCharts,
  });

    // Hook de tabla para categorías
  const categoriesTableResult = useCategoriesTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    enableCharts,
  });

  // Hook de tabla para transacciones fallidas
  const failedTransactionsTableResult = useFailedTransactionsTable(transactionsList, {
    title,
    tableTitle,
    showDatePicker,
    enableCharts,
    chartReportsData,
    includeActions,
  });

  // Seleccionar el resultado correcto según el tipo de chart
  const {
    config,
    chartConfig,
    tableData,
    tableColumns,
  } = chartType === 'top-municipalities'
    ? municipalitiesTableResult
    : chartType === 'top-products'
    ? productsTableResult
    : chartType === 'top-categories'
    ? categoriesTableResult
    : chartType === 'transactions-failed'
    ? failedTransactionsTableResult
    : transactionsTableResult;

  // Hook de loading
  const {
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,
  } = useTransactionsLoading(
    isLoadingReports,
    isLoadingChart,
    isInitialLoad,
    {
      initialMessage,
      overlayMessage,
      showOverlay,
    }
  );

  // Función combinada para limpiar todo
  const handleClearAll = () => {
    handleClearFilters();
    handleClearSearchData();
  };

  return {
    // Estados de filtros
    selectedClients,
    amountFilter,
    clients,
    customers,
    reportsFilters,
    
    // Estados de datos
    isLoadingReports,
    isLoadingChart,
    isInitialLoad,
    transactionsList,
    reportsPagination,
    chartReportsData,
    
    // Estados de tabla
    config,
    chartConfig,
    tableData,
    tableColumns,
    
    // Estados de loading
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,
    
    // Funciones de filtros
    handleAmountFilter,
    handleClientFilter,
    handleDateRangeChange,
    handleClearFilters,
    handleResetFilters,
    
    // Funciones de datos
    handleFilter,
    handlePageChange,
    handleClearSearch: handleClearSearchData,
    
    // Función combinada
    handleClearAll,
  };
};

/**
 * Hook maestro especializado para transacciones
 */
export const useTransactionsDashboard = (
  title: string,
  tableTitle: string,
  options: Partial<UseDashboardMasterOptions> = {}
) => {
  return useDashboardMaster({
    title,
    tableTitle,
    perPage: 10,
    enableClientFilter: true,
    enableAmountFilter: true,
    enableDateFilter: true,
    enableChartData: true,
    enableCustomers: true,
    chartType: 'transactions',
    showDatePicker: true,
    enableCharts: true,
    includeActions: false,
    initialMessage: 'Cargando transacciones...',
    overlayMessage: 'Actualizando transacciones...',
    showOverlay: true,
    ...options,
  });
};

/**
 * Hook maestro especializado para municipalidades
 */
export const useMunicipalitiesDashboard = (
  title: string,
  tableTitle: string,
  options: Partial<UseDashboardMasterOptions> = {}
) => {
  return useDashboardMaster({
    title,
    tableTitle,
    perPage: 10,
    enableClientFilter: false, // No incluir filtro de clientes para municipalidades
    enableAmountFilter: true,
    enableDateFilter: true,
    enableChartData: true,
    enableCustomers: false, // No incluir customers para municipalidades
    chartType: 'top-municipalities',
    showDatePicker: true,
    enableCharts: true,
    includeActions: false,
    initialMessage: 'Cargando municipalidades...',
    overlayMessage: 'Actualizando municipalidades...',
    showOverlay: true,
    ...options,
  });
};

/**
 * Hook maestro especializado para productos
 */
export const useProductsDashboard = (
  title: string,
  tableTitle: string,
  options: Partial<UseDashboardMasterOptions> = {}
) => {
  return useDashboardMaster({
    title,
    tableTitle,
    perPage: 10,
    enableClientFilter: true, // Incluir filtro de clientes para productos
    enableAmountFilter: true,
    enableDateFilter: true,
    enableChartData: true,
    enableCustomers: true, // Incluir customers para productos
    chartType: 'top-products',
    showDatePicker: true,
    enableCharts: true,
    includeActions: false,
    initialMessage: 'Cargando productos...',
    overlayMessage: 'Actualizando productos...',
    showOverlay: true,
    ...options,
  });
};

/**
 * Hook maestro especializado para categorías
 */
export const useCategoriesDashboard = (
  title: string,
  tableTitle: string,
  options: Partial<UseDashboardMasterOptions> = {}
) => {
  return useDashboardMaster({
    title,
    tableTitle,
    perPage: 10,
    enableClientFilter: true, // Incluir filtro de clientes para categorías
    enableAmountFilter: true,
    enableDateFilter: true,
    enableChartData: true,
    enableCustomers: true, // Incluir customers para categorías
    chartType: 'top-categories',
    showDatePicker: true,
    enableCharts: true,
    includeActions: false,
    initialMessage: 'Cargando categorías...',
    overlayMessage: 'Actualizando categorías...',
    showOverlay: true,
    ...options,
  });
};

/**
 * Hook maestro especializado para transacciones fallidas
 */
export const useFailedTransactionsDashboard = (
  title: string,
  tableTitle: string,
  options: Partial<UseDashboardMasterOptions> = {}
) => {
  return useDashboardMaster({
    title,
    tableTitle,
    perPage: 10,
    enableClientFilter: true, // Incluir filtro de clientes para transacciones fallidas
    enableAmountFilter: true,
    enableDateFilter: true,
    enableChartData: true,
    enableCustomers: true, // Incluir customers para transacciones fallidas
    chartType: 'transactions-failed',
    showDatePicker: true,
    enableCharts: true,
    includeActions: true, // Habilitar acciones para el overlay
    initialMessage: 'Cargando transacciones fallidas...',
    overlayMessage: 'Actualizando transacciones fallidas...',
    showOverlay: true,
    ...options,
  });
}; 