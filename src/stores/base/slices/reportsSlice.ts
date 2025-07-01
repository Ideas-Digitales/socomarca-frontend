import { StateCreator } from 'zustand';
import {
  fetchGetOrdersReportsTransactionsList,
} from '@/services/actions/reports.actions';
import { ApiResponse, PaginationMeta } from '../types';

export interface TableDetail {
  id: number;
  customer: string;
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

export interface TransactionsResponse {
  table_detail: TableDetail[];
  pagination: Pagination;
}

export interface ReportsFilters {
  start: string;
  end: string;
}

export interface ReportsState {
  // Data states
  transactionsList: TableDetail[];
  selectedTransaction: TableDetail | null;
  
  // Pagination states
  reportsCurrentPage: number;
  reportsPagination: PaginationMeta | null;
  
  // Loading states
  isLoadingReports: boolean;
  
  // Filter states
  reportsFilters: ReportsFilters;
}

export interface ReportsSlice extends ReportsState {
  // Actions
  fetchTransactionsList: (
    start: string,
    end: string,
    page?: number,
    per_page?: number
  ) => Promise<ApiResponse<TransactionsResponse>>;
  
  // Pagination actions
  setReportsCurrentPage: (page: number) => void;
  nextReportsPage: () => void;
  prevReportsPage: () => void;
  
  // Filter actions
  setReportsFilters: (filters: ReportsFilters) => void;
  clearReportsFilters: () => void;
  
  // State management
  setSelectedTransaction: (transaction: TableDetail | null) => void;
  resetReportsState: () => void;
}

const initialReportsState: ReportsState = {
  // Data states
  transactionsList: [],
  selectedTransaction: null,
  
  // Pagination states
  reportsCurrentPage: 1,
  reportsPagination: null,
  
  // Loading states
  isLoadingReports: false,
  
  // Filter states
  reportsFilters: {
    start: '',
    end: '',
  },
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
  fetchTransactionsList: async (start: string, end: string, page = 1, per_page = 20) => {
    set({ isLoadingReports: true });
    
    try {
      const result = await fetchGetOrdersReportsTransactionsList(start, end, per_page, page);
      
      if (result.ok && result.data) {
        const convertedPagination = convertPagination(result.data.pagination);
        
        set({
          transactionsList: result.data.table_detail,
          reportsPagination: convertedPagination,
          reportsCurrentPage: page,
          isLoadingReports: false,
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

  // Pagination actions
  setReportsCurrentPage: (page: number) => {
    set({ reportsCurrentPage: page });
  },

  nextReportsPage: () => {
    const { reportsCurrentPage, reportsPagination, reportsFilters } = get();
    if (reportsPagination && reportsCurrentPage < reportsPagination.last_page) {
      const newPage = reportsCurrentPage + 1;
      const perPage = reportsPagination.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ reportsCurrentPage: newPage });
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage);
    }
  },

  prevReportsPage: () => {
    const { reportsCurrentPage, reportsPagination, reportsFilters } = get();
    if (reportsCurrentPage > 1) {
      const newPage = reportsCurrentPage - 1;
      const perPage = reportsPagination?.per_page || 20; // Usar el per_page actual o fallback a 20
      set({ reportsCurrentPage: newPage });
      get().fetchTransactionsList(reportsFilters.start, reportsFilters.end, newPage, perPage);
    }
  },

  // Filter actions
  setReportsFilters: (filters: ReportsFilters) => {
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
      },
      reportsCurrentPage: 1
    });
  },

  // State management
  setSelectedTransaction: (transaction: TableDetail | null) => {
    set({ selectedTransaction: transaction });
  },

  resetReportsState: () => {
    set(initialReportsState);
  },
});
