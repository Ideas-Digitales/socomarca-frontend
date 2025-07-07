import { StateCreator } from 'zustand';
import {
  fetchGetOrdersReportsTransactionsList,
  fetchGetOrdersReportsFailedTransactionsList,
  fetchGetOrdersReportsCharts,
} from '@/services/actions/reports.actions';
import { ApiResponse, PaginationMeta } from '../types';

export interface TableDetail {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

export interface FailedTransactionDetail {
  id: number;
  client: string;
  amount: number;
  date: string;
  status: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TransactionsApiResponse {
  table_detail: TableDetail[];
  pagination: Pagination;
  clients: string[];
  parameters: {
    start?: string;
    end?: string;
    client?: string | null;
    category?: string | null;
    type?: 'exitosa' | 'fallida' | null;
  };
}

export interface FailedTransactionsApiResponse {
  table_detail: FailedTransactionDetail[];
  pagination: Pagination;
  clients: string[];
  parameters: {
    start?: string;
    end?: string;
    client?: string | null;
    category?: string | null;
    type?: 'exitosa' | 'fallida' | null;
  };
}

export type ChartReportType = 'transactions' | 'sales' | 'revenue' | 'top-clients' | 'top-products' | 'top-categories' | 'transactions-failed' | 'top-municipalities';

export interface ChartReportsResponse {
  months: string[];
  clients: string[];
  totals: {
    month: string;
    sales_by_client: {
      client: string;
      total: number;
    }[];
  }[];
  total_buyers_per_month: {
    month: string;
    total_buyers: number;
  }[];
}

export interface TopMunicipalitiesResponse {
  top_municipalities: {
    month: string;
    municipality: string;
    total_purchases: number;
    quantity: number;
  }[];
  total_purchases: number;
  quantity: number;
}

export interface TopProductsResponse {
  top_products: {
    month: string;
    product: string;
    total: number;
  }[];
  total_sales: number;
}

export interface TopCategoriesResponse {
  top_categories: {
    month: string;
    category: string;
    total: number;
  }[];
  total_sales: number;
  average_sales: number;
}

export interface ReportsFilters {
  start: string;
  end: string;
  selectedClient?: string;
  selectedCategory?: string;
  type?: 'exitosa' | 'fallida' | null;
}

export interface ReportsState {
  // Data states - Successful transactions
  transactionsList: TableDetail[];
  selectedTransaction: TableDetail | null;
  uniqueClients: string[];
  
  // Data states - Failed transactions
  failedTransactionsList: FailedTransactionDetail[];
  selectedFailedTransaction: FailedTransactionDetail | null;
  uniqueFailedClients: string[];
  
  // Pagination states - Successful transactions
  reportsCurrentPage: number;
  reportsPagination: PaginationMeta | null;
  
  // Pagination states - Failed transactions
  failedReportsCurrentPage: number;
  failedReportsPagination: PaginationMeta | null;
  
  // Loading states
  isLoadingReports: boolean;
  isLoadingFailedReports: boolean;
  isLoadingChartReports: boolean;
  
  // Chart reports data
  chartReportsData: ChartReportsResponse | null;
  
  // Top municipalities data
  topMunicipalitiesData: TopMunicipalitiesResponse | null;
  isLoadingTopMunicipalities: boolean;
  
  // Top products data
  topProductsData: TopProductsResponse | null;
  isLoadingTopProducts: boolean;
  
  // Top categories data
  topCategoriesData: TopCategoriesResponse | null;
  isLoadingTopCategories: boolean;
  
  // Filter states
  reportsFilters: ReportsFilters;
  failedReportsFilters: ReportsFilters;
  
  // API response parameters
  lastApiParameters: TransactionsApiResponse['parameters'] | null;
  lastFailedApiParameters: TransactionsApiResponse['parameters'] | null;
}

export interface ReportsSlice extends ReportsState {
  // Actions - Successful transactions
  fetchTransactionsList: (
    start: string,
    end: string,
    page?: number,
    per_page?: number,
    client?: string | null
  ) => Promise<ApiResponse<TransactionsApiResponse>>;
  
  // Actions - Failed transactions
  fetchFailedTransactionsList: (
    start: string,
    end: string,
    page?: number,
    per_page?: number,
    client?: string | null
  ) => Promise<ApiResponse<FailedTransactionsApiResponse>>;
  
  // Actions - Chart reports
  fetchChartReports: (
    start: string,
    end: string,
    type: ChartReportType
  ) => Promise<ApiResponse<ChartReportsResponse>>;
  clearChartReports: () => void;
  
  // Actions - Top municipalities
  fetchTopMunicipalities: (
    start: string,
    end: string
  ) => Promise<ApiResponse<TopMunicipalitiesResponse>>;
  clearTopMunicipalities: () => void;
  
  // Actions - Top products
  fetchTopProducts: (
    start: string,
    end: string
  ) => Promise<ApiResponse<TopProductsResponse>>;
  clearTopProducts: () => void;
  
  // Actions - Top categories
  fetchTopCategories: (
    start: string,
    end: string
  ) => Promise<ApiResponse<TopCategoriesResponse>>;
  clearTopCategories: () => void;
  
  // Client management
  // extractUniqueClients: () => void;
  // getFilteredTransactions: () => TableDetail[];
  
  // Filter actions - Successful transactions
  setReportsFilters: (filters: Partial<ReportsFilters>) => void;
  clearReportsFilters: () => void;
  
  // Filter actions - Failed transactions
  setFailedReportsFilters: (filters: Partial<ReportsFilters>) => void;
  clearFailedReportsFilters: () => void;
  
  // Pagination actions - Successful transactions
  setReportsCurrentPage: (page: number) => void;
  nextReportsPage: () => void;
  prevReportsPage: () => void;
  
  // Pagination actions - Failed transactions
  setFailedReportsCurrentPage: (page: number) => void;
  nextFailedReportsPage: () => void;
  prevFailedReportsPage: () => void;
  
  // State management
  setSelectedTransaction: (transaction: TableDetail | null) => void;
  setSelectedFailedTransaction: (transaction: FailedTransactionDetail | null) => void;
  resetReportsState: () => void;
}

const initialReportsState: ReportsState = {
  // Data states - Successful transactions
  transactionsList: [],
  selectedTransaction: null,
  uniqueClients: [],
  
  // Data states - Failed transactions
  failedTransactionsList: [],
  selectedFailedTransaction: null,
  uniqueFailedClients: [],
  
  // Pagination states - Successful transactions
  reportsCurrentPage: 1,
  reportsPagination: null,
  
  // Pagination states - Failed transactions
  failedReportsCurrentPage: 1,
  failedReportsPagination: null,
  
  // Loading states
  isLoadingReports: false,
  isLoadingFailedReports: false,
  isLoadingChartReports: false,
  
  // Chart reports data
  chartReportsData: null,
  
  // Top municipalities data
  topMunicipalitiesData: null,
  isLoadingTopMunicipalities: false,
  
  // Top products data
  topProductsData: null,
  isLoadingTopProducts: false,
  
  // Top categories data
  topCategoriesData: null,
  isLoadingTopCategories: false,
  
  // Filter states
  reportsFilters: {
    start: '',
    end: '',
    selectedClient: undefined,
    selectedCategory: undefined,
    type: null,
  },
  failedReportsFilters: {
    start: '',
    end: '',
    selectedClient: undefined,
    selectedCategory: undefined,
    type: null,
  },
  
  // API response
  lastApiParameters: null,
  lastFailedApiParameters: null,
};

// Función helper para convertir paginación del backend al formato esperado por los componentes
const convertPagination = (backendPagination: Pagination): PaginationMeta => {
  const from = backendPagination.per_page * (backendPagination.current_page - 1) + 1;
  const to = Math.min(
    backendPagination.per_page * backendPagination.current_page,
    backendPagination.total
  );

  return {
    current_page: backendPagination.current_page,
    from,
    last_page: backendPagination.last_page,
    links: [],
    path: '',
    per_page: backendPagination.per_page,
    to,
    total: backendPagination.total,
  };
};

export const createReportsSlice: StateCreator<
  ReportsSlice,
  [],
  [],
  ReportsSlice
> = (set, get) => ({
  ...initialReportsState,

  // Fetch transactions list con paginación y filtros
  fetchTransactionsList: async (start: string, end: string, page = 1, per_page = 20, client = null) => {
    set({ isLoadingReports: true });
    const endpoint = 'transactions';
    
    try {
      const result = await fetchGetOrdersReportsTransactionsList(start, end, per_page, page, endpoint, client, 'exitosa');
      
      if (result.ok && result.data) {
        const convertedPagination = convertPagination(result.data.pagination);
        
        set({
          transactionsList: result.data.table_detail,
          uniqueClients: result.data.clients || [], // Actualizar clientes únicos desde el backend
          reportsPagination: convertedPagination,
          reportsCurrentPage: page,
          isLoadingReports: false,
          lastApiParameters: result.data.parameters || null,
        });
        
        return {
          ok: true,
          data: result.data,
        };
      } else {
        set({ isLoadingReports: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar lista de transacciones',
          },
        };
      }
    } catch (error) {
      set({ isLoadingReports: false });
      console.error('Error in fetchTransactionsList:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Fetch failed transactions list con paginación y filtros
  fetchFailedTransactionsList: async (start: string, end: string, page = 1, per_page = 20, client = null) => {
    set({ isLoadingFailedReports: true });
    const endpoint = 'failedTransactions';
    
    try {
      const result = await fetchGetOrdersReportsFailedTransactionsList(start, end, per_page, page, endpoint, client, 'fallida');
      
      if (result.ok && result.data) {
        const convertedPagination = convertPagination(result.data.pagination);
        
        // Mapear los datos del backend que vienen con 'customer' a nuestra interfaz que espera 'client'
        const mappedTableDetail: FailedTransactionDetail[] = result.data.table_detail.map((item: any) => ({
          id: item.id,
          client: item.client || item.customer, // Usar 'client' si está disponible, sino 'customer'
          amount: item.amount,
          date: item.date,
          status: item.status,
        }));
        
        set({
          failedTransactionsList: mappedTableDetail,
          uniqueFailedClients: result.data.clients || [], // Actualizar clientes únicos desde el backend
          failedReportsPagination: convertedPagination,
          failedReportsCurrentPage: page,
          isLoadingFailedReports: false,
          lastFailedApiParameters: result.data.parameters || null,
        });
        
        return {
          ok: true,
          data: {
            ...result.data,
            table_detail: mappedTableDetail,
          },
        };
      } else {
        set({ isLoadingFailedReports: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar lista de transacciones fallidas',
          },
        };
      }
    } catch (error) {
      set({ isLoadingFailedReports: false });
      console.error('Error in fetchFailedTransactionsList:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Fetch chart reports
  fetchChartReports: async (start: string, end: string, type: ChartReportType) => {
    set({ isLoadingChartReports: true });
    
    try {
      const result = await fetchGetOrdersReportsCharts(start, end, type);
      
      if (result.ok && result.data) {
        set({
          chartReportsData: result.data,
          isLoadingChartReports: false,
        });
        
        return {
          ok: true,
          data: result.data,
        };
      } else {
        set({ isLoadingChartReports: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar reportes de gráficos',
          },
        };
      }
    } catch (error) {
      set({ isLoadingChartReports: false });
      console.error('Error in fetchChartReports:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Clear chart reports data
  clearChartReports: () => {
    set({ chartReportsData: null });
  },

  // Fetch top municipalities
  fetchTopMunicipalities: async (start: string, end: string) => {
    set({ isLoadingTopMunicipalities: true });
    
    try {
      const result = await fetchGetOrdersReportsCharts(start, end, 'top-municipalities');
      
      if (result.ok && result.data) {
        set({
          topMunicipalitiesData: result.data as unknown as TopMunicipalitiesResponse,
          isLoadingTopMunicipalities: false,
        });
        
        return {
          ok: true,
          data: result.data as unknown as TopMunicipalitiesResponse,
        };
      } else {
        set({ isLoadingTopMunicipalities: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar datos de municipalidades',
          },
        };
      }
    } catch (error) {
      set({ isLoadingTopMunicipalities: false });
      console.error('Error in fetchTopMunicipalities:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Clear top municipalities data
  clearTopMunicipalities: () => {
    set({ topMunicipalitiesData: null });
  },

  // Fetch top products
  fetchTopProducts: async (start: string, end: string) => {
    set({ isLoadingTopProducts: true });
    
    try {
      const result = await fetchGetOrdersReportsCharts(start, end, 'top-products');
      
      if (result.ok && result.data) {
        set({
          topProductsData: result.data as unknown as TopProductsResponse,
          isLoadingTopProducts: false,
        });
        
        return {
          ok: true,
          data: result.data as unknown as TopProductsResponse,
        };
      } else {
        set({ isLoadingTopProducts: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar datos de productos',
          },
        };
      }
    } catch (error) {
      set({ isLoadingTopProducts: false });
      console.error('Error in fetchTopProducts:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Clear top products data
  clearTopProducts: () => {
    set({ topProductsData: null });
  },

  // Fetch top categories
  fetchTopCategories: async (start: string, end: string) => {
    set({ isLoadingTopCategories: true });
    
    try {
      const result = await fetchGetOrdersReportsCharts(start, end, 'top-categories');
      
      if (result.ok && result.data) {
        set({
          topCategoriesData: result.data as unknown as TopCategoriesResponse,
          isLoadingTopCategories: false,
        });
        
        return {
          ok: true,
          data: result.data as unknown as TopCategoriesResponse,
        };
      } else {
        set({ isLoadingTopCategories: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar datos de categorías',
          },
        };
      }
    } catch (error) {
      set({ isLoadingTopCategories: false });
      console.error('Error in fetchTopCategories:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Clear top categories data
  clearTopCategories: () => {
    set({ topCategoriesData: null });
  },

  // Filter actions - Successful transactions
  setReportsFilters: (filters: Partial<ReportsFilters>) => {
    set({ 
      reportsFilters: { ...get().reportsFilters, ...filters },
      reportsCurrentPage: 1 // Reset to first page when filters change
    });
  },

  clearReportsFilters: () => {
    set({ 
      reportsFilters: {
        start: '',
        end: '',
        selectedClient: undefined,
        selectedCategory: undefined,
        type: null,
      },
      reportsCurrentPage: 1
    });
  },

  // Filter actions - Failed transactions
  setFailedReportsFilters: (filters: Partial<ReportsFilters>) => {
    set({ 
      failedReportsFilters: { ...get().failedReportsFilters, ...filters },
      failedReportsCurrentPage: 1 // Reset to first page when filters change
    });
  },

  clearFailedReportsFilters: () => {
    set({ 
      failedReportsFilters: {
        start: '',
        end: '',
        selectedClient: undefined,
        selectedCategory: undefined,
        type: null,
      },
      failedReportsCurrentPage: 1
    });
  },

  // Pagination actions - Successful transactions
  setReportsCurrentPage: (page: number) => {
    set({ reportsCurrentPage: page });
  },

  nextReportsPage: () => {
    const { reportsCurrentPage, reportsPagination, reportsFilters } = get();
    if (reportsPagination && reportsCurrentPage < reportsPagination.last_page) {
      const newPage = reportsCurrentPage + 1;
      const perPage = reportsPagination.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ reportsCurrentPage: newPage });
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage, reportsFilters.selectedClient);
    }
  },

  prevReportsPage: () => {
    const { reportsCurrentPage, reportsPagination, reportsFilters } = get();
    if (reportsCurrentPage > 1) {
      const newPage = reportsCurrentPage - 1;
      const perPage = reportsPagination?.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ reportsCurrentPage: newPage });
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage, reportsFilters.selectedClient);
    }
  },

  // Pagination actions - Failed transactions
  setFailedReportsCurrentPage: (page: number) => {
    set({ failedReportsCurrentPage: page });
  },

  nextFailedReportsPage: () => {
    const { failedReportsCurrentPage, failedReportsPagination, failedReportsFilters } = get();
    if (failedReportsPagination && failedReportsCurrentPage < failedReportsPagination.last_page) {
      const newPage = failedReportsCurrentPage + 1;
      const perPage = failedReportsPagination.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ failedReportsCurrentPage: newPage });
      get().fetchFailedTransactionsList(failedReportsFilters.start, failedReportsFilters.end, newPage, perPage, failedReportsFilters.selectedClient);
    }
  },

  prevFailedReportsPage: () => {
    const { failedReportsCurrentPage, failedReportsPagination, failedReportsFilters } = get();
    if (failedReportsCurrentPage > 1) {
      const newPage = failedReportsCurrentPage - 1;
      const perPage = failedReportsPagination?.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ failedReportsCurrentPage: newPage });
      get().fetchFailedTransactionsList(failedReportsFilters.start, failedReportsFilters.end, newPage, perPage, failedReportsFilters.selectedClient);
    }
  },

  // State management
  setSelectedTransaction: (transaction: TableDetail | null) => {
    set({ selectedTransaction: transaction });
  },

  setSelectedFailedTransaction: (transaction: FailedTransactionDetail | null) => {
    set({ selectedFailedTransaction: transaction });
  },

    resetReportsState: () => {
    set(initialReportsState);
  },
});
