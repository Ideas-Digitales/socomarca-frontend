import { StateCreator } from 'zustand';
import {
  fetchGetOrdersReportsTransactionsList,
  fetchGetOrdersReportsFailedTransactionsList,
  fetchGetOrdersReportsCharts,
  fetchGetTransactionDetails,
  TransactionDetails,
  fetchGetClientsMostPurchasesList,
} from '@/services/actions/reports.actions';
import { ApiResponse, PaginationMeta } from '../types';

export interface TableDetail {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

// Nueva interfaz para la respuesta del backend en español
export interface BackendTableDetail {
  id: number;
  cliente: string;
  monto: number;
  fecha: string;
  estado: string;
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

// Nueva interfaz para la respuesta del backend
export interface BackendTransactionsApiResponse {
  detalle_tabla: BackendTableDetail[];
  pagination: Pagination;
  clients?: string[];
  parameters?: {
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

export type ChartReportsResponseType = ChartReportsResponse | TopMunicipalitiesResponse;

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
  total_min?: number;
  total_max?: number;
}

export interface ClientsMostPurchasesDetail {
  id: number;
  cliente: string;
  monto: number;
  fecha: string;
  acciones?: string;
}

export interface ClientsMostPurchasesFilters {
  start?: string;
  end?: string;
  total_min?: number;
  total_max?: number;
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
  
  // Transaction details state
  transactionDetails: TransactionDetails | null;
  isLoadingTransactionDetails: boolean;
  
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
  chartReportsData: ChartReportsResponseType | null;
  
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
  
  // Clientes con más compras
  clientsMostPurchasesList: ClientsMostPurchasesDetail[];
  clientsMostPurchasesPagination: PaginationMeta | null;
  isLoadingClientsMostPurchases: boolean;
  clientsMostPurchasesFilters: ClientsMostPurchasesFilters;
  clientsMostPurchasesCurrentPage: number;
}

export interface ReportsSlice extends ReportsState {
  // Actions - Successful transactions
  fetchTransactionsList: (
    start: string,
    end: string,
    page?: number,
    per_page?: number,
    client?: string | null,
    total_min?: number,
    total_max?: number
  ) => Promise<ApiResponse<TransactionsApiResponse>>;
  
  // Actions - Failed transactions
  fetchFailedTransactionsList: (
    start: string,
    end: string,
    page?: number,
    per_page?: number,
    client?: string | null,
    total_min?: number,
    total_max?: number
  ) => Promise<ApiResponse<FailedTransactionsApiResponse>>;
  
  // Actions - Transaction details
  fetchTransactionDetails: (
    transactionId: number
  ) => Promise<ApiResponse<TransactionDetails>>;
  clearTransactionDetails: () => void;
  
  // Actions - Chart reports
  fetchChartReports: (
    start: string,
    end: string,
    type: ChartReportType
  ) => Promise<ApiResponse<ChartReportsResponseType>>;
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
    end: string,
    selectedClient: string | null | undefined,
    selectedCategory: string | null | undefined,
    total_min: number | undefined,
    total_max: number | undefined
  ) => Promise<ApiResponse<TopProductsResponse>>;
  clearTopProducts: () => void;
  
  // Actions - Top categories
  fetchTopCategories: (
    start: string,
    end: string
  ) => Promise<ApiResponse<TopCategoriesResponse>>;
  clearTopCategories: () => void;
  
  // Clientes con más compras
  fetchClientsMostPurchasesList: (
    start: string,
    end: string,
    per_page: number,
    page: number,
    total_min?: number,
    total_max?: number
  ) => Promise<void>;
  setClientsMostPurchasesFilters: (filters: ClientsMostPurchasesFilters) => void;
  setClientsMostPurchasesCurrentPage: (page: number) => void;
  clearClientsMostPurchasesFilters: () => void;
  
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
  
  // Transaction details state
  transactionDetails: null,
  isLoadingTransactionDetails: false,
  
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
    total_min: undefined,
    total_max: undefined,
  },
  failedReportsFilters: {
    start: '',
    end: '',
    selectedClient: undefined,
    selectedCategory: undefined,
    type: null,
    total_min: undefined,
    total_max: undefined,
  },
  
  // API response
  lastApiParameters: null,
  lastFailedApiParameters: null,
  
  // Clientes con más compras
  clientsMostPurchasesList: [],
  clientsMostPurchasesPagination: null,
  isLoadingClientsMostPurchases: false,
  clientsMostPurchasesFilters: {},
  clientsMostPurchasesCurrentPage: 1,
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
  fetchTransactionsList: async (start: string, end: string, page = 1, per_page = 20, client = null, total_min?: number, total_max?: number) => {
    set({ isLoadingReports: true });
    const endpoint = 'transactions';
    
    try {
      const result = await fetchGetOrdersReportsTransactionsList(start, end, per_page, page, endpoint, client, 'exitosa', total_min, total_max);
      
      if (result.ok && result.data) {
        const convertedPagination = convertPagination(result.data.pagination);
        
        // Mapear los datos del backend que vienen en español a nuestra interfaz
        const mappedTableDetail: TableDetail[] = (result.data.detalle_tabla || result.data.table_detail || []).map((item: any) => ({
          id: item.id,
          customer: item.cliente || item.customer, // Usar 'cliente' si está disponible, sino 'customer'
          amount: item.monto || item.amount, // Usar 'monto' si está disponible, sino 'amount'
          date: item.fecha || item.date, // Usar 'fecha' si está disponible, sino 'date'
          status: item.estado || item.status, // Usar 'estado' si está disponible, sino 'status'
        }));
        
        // Extraer clientes únicos de los datos mapeados
        const uniqueClients = Array.from(new Set(mappedTableDetail.map(item => item.customer))).sort();
        
        set({
          transactionsList: mappedTableDetail,
          uniqueClients: uniqueClients,
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
  fetchFailedTransactionsList: async (start: string, end: string, page = 1, per_page = 20, client = null, total_min?: number, total_max?: number) => {
    set({ isLoadingFailedReports: true });
    const endpoint = 'failedTransactions';
    
    try {
      const result = await fetchGetOrdersReportsFailedTransactionsList(start, end, per_page, page, endpoint, client, 'fallida', total_min, total_max);
      
      if (result.ok && result.data) {
        const convertedPagination = convertPagination(result.data.pagination);
        
        // Mapear los datos del backend que vienen en español a nuestra interfaz
        const mappedTableDetail: FailedTransactionDetail[] = (result.data.detalle_tabla || result.data.table_detail || []).map((item: any) => ({
          id: item.id,
          client: item.cliente || item.client || item.customer, // Usar 'cliente' si está disponible, sino 'client' o 'customer'
          amount: item.monto || item.amount, // Usar 'monto' si está disponible, sino 'amount'
          date: item.fecha || item.date, // Usar 'fecha' si está disponible, sino 'date'
          status: item.estado || item.status, // Usar 'estado' si está disponible, sino 'status'
        }));
        
        // Extraer clientes únicos de los datos mapeados
        const uniqueFailedClients = Array.from(new Set(mappedTableDetail.map(item => item.client))).sort();
        
        set({
          failedTransactionsList: mappedTableDetail,
          uniqueFailedClients: uniqueFailedClients,
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

  // Fetch transaction details
  fetchTransactionDetails: async (transactionId: number) => {
    set({ isLoadingTransactionDetails: true });
    
    try {
      const result = await fetchGetTransactionDetails(transactionId);
      
      if (result.ok && result.data) {
        set({
          transactionDetails: result.data,
          isLoadingTransactionDetails: false,
        });
        
        return {
          ok: true,
          data: result.data,
        };
      } else {
        set({ isLoadingTransactionDetails: false });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar detalles de la transacción',
          },
        };
      }
    } catch (error) {
      set({ isLoadingTransactionDetails: false });
      console.error('Error in fetchTransactionDetails:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Clear transaction details
  clearTransactionDetails: () => {
    set({ transactionDetails: null });
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
        // Asegurar que los datos coincidan con la interfaz TopMunicipalitiesResponse
        const topMunicipalitiesData: TopMunicipalitiesResponse = {
          top_municipalities: result.data.top_municipalities || [],
          total_purchases: result.data.total_purchases || 0,
          quantity: result.data.quantity || 0,
        };
        
        set({
          topMunicipalitiesData,
          isLoadingTopMunicipalities: false,
        });
        
        return {
          ok: true,
          data: topMunicipalitiesData,
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
  fetchTopProducts: async (
    start: string,
    end: string,
  ) => {
    set({ isLoadingTopProducts: true });
    try {
      const result = await fetchGetOrdersReportsCharts(start, end, 'top-products');
      console.log('result', result);
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

  // Clientes con más compras
  fetchClientsMostPurchasesList: async (start, end, per_page, page, total_min, total_max) => {
    set({ isLoadingClientsMostPurchases: true });
    try {
      const result = await fetchGetClientsMostPurchasesList(start, end, per_page, page, total_min, total_max);
      if (result.ok && result.data) {
        set({
          clientsMostPurchasesList: result.data.table_detail || [],
          clientsMostPurchasesPagination: result.data.pagination || null,
          clientsMostPurchasesCurrentPage: page,
          isLoadingClientsMostPurchases: false,
        });
      } else {
        set({
          isLoadingClientsMostPurchases: false,
        });
      }
    } catch (error) {
      console.error('Error in fetchClientsMostPurchasesList:', error);
      set({ isLoadingClientsMostPurchases: false });
    }
  },
  setClientsMostPurchasesFilters: (filters: ClientsMostPurchasesFilters) => {
    set({ clientsMostPurchasesFilters: filters });
  },
  setClientsMostPurchasesCurrentPage: (page: number) => {
    set({ clientsMostPurchasesCurrentPage: page });
  },
  clearClientsMostPurchasesFilters: () => {
    set({
      clientsMostPurchasesFilters: {},
      clientsMostPurchasesCurrentPage: 1,
    });
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
        total_min: undefined,
        total_max: undefined,
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
        total_min: undefined,
        total_max: undefined,
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
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage, reportsFilters.selectedClient, reportsFilters.total_min, reportsFilters.total_max);
    }
  },

  prevReportsPage: () => {
    const { reportsCurrentPage, reportsPagination, reportsFilters } = get();
    if (reportsCurrentPage > 1) {
      const newPage = reportsCurrentPage - 1;
      const perPage = reportsPagination?.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ reportsCurrentPage: newPage });
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage, reportsFilters.selectedClient, reportsFilters.total_min, reportsFilters.total_max);
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
      get().fetchFailedTransactionsList(failedReportsFilters.start, failedReportsFilters.end, newPage, perPage, failedReportsFilters.selectedClient, failedReportsFilters.total_min, failedReportsFilters.total_max);
    }
  },

  prevFailedReportsPage: () => {
    const { failedReportsCurrentPage, failedReportsPagination, failedReportsFilters } = get();
    if (failedReportsCurrentPage > 1) {
      const newPage = failedReportsCurrentPage - 1;
      const perPage = failedReportsPagination?.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ failedReportsCurrentPage: newPage });
      get().fetchFailedTransactionsList(failedReportsFilters.start, failedReportsFilters.end, newPage, perPage, failedReportsFilters.selectedClient, failedReportsFilters.total_min, failedReportsFilters.total_max);
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
