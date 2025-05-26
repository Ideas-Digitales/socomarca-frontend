import { PaginationMeta } from '@/stores/base/types';
import { Category } from './category.interface';

export interface MetricCard {
  label: string;
  value: string | number;
  color: 'lime' | 'gray';
}

export interface DashboardTableConfig {
  title: string;
  showTable: boolean;
  tableTitle: string;
}

export interface DashboardConfig extends DashboardTableConfig {
  metrics: MetricCard[];
  showBottomChart?: boolean;
}

// Exportar la interfaz para uso en las páginas
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DashboardTableLayoutProps<T = any> {
  config: DashboardTableConfig;
  tableData?: T[];
  tableColumns?: TableColumn<T>[];
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onFilter?: () => void;
  onCategoryFilter?: () => void;
  onProviderFilter?: () => void;
  onSortBy?: () => void;
  categoryFilterOptions?: string[];
  providerFilterOptions?: string[];
  sortByOptions?: string[];
  categories: Category[];
}
export interface DashboardLayoutProps<T = any> {
  config: DashboardConfig;
  tableData?: T[];
  tableColumns?: TableColumn<T>[];
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onAmountFilter?: () => void;
  onClientFilter?: () => void;
  onCategoryFilter?: () => void;
  onFilter?: () => void;
}
