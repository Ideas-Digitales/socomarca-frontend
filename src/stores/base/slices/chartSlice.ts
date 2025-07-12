import { StateCreator } from 'zustand';
import { fetchGetOrdersReportsTransactionsList } from '@/services/actions/reports.actions';

export interface ChartRawPoint {
  date: string;
  amount: number;
}

export interface ChartReportsResponseType {
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

export interface ChartSlice {
  chartRawData: ChartRawPoint[];
  chartReportsData: ChartReportsResponseType | null;
  isLoadingChart: boolean;
  chartError: string | null;
  fetchChartRawData: (start?: string, end?: string, client?: string | null) => Promise<void>;
}

export const createChartSlice: StateCreator<ChartSlice> = (set) => ({
  chartRawData: [],
  chartReportsData: null,
  isLoadingChart: false,
  chartError: null,
  fetchChartRawData: async (start = '', end = '', client: string | null = null) => {
    set({ isLoadingChart: true, chartError: null });
    const result = await fetchGetOrdersReportsTransactionsList(start, end, 100, 1, 'transactions', client, 'exitosa', undefined, undefined);
    if (result.ok && result.data && result.data.table_detail) {
      const chartRawData = result.data.table_detail.map((item: any) => ({
        date: item.date,
        amount: item.amount,
      }));
      set({ chartRawData, isLoadingChart: false, chartError: null });
    } else {
      set({ chartRawData: [], isLoadingChart: false, chartError: result.error || 'Error al cargar datos del gráfico' });
    }
  },
}); 