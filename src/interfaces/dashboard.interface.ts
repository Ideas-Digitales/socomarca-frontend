import { PaginationMeta } from '@/stores/base/types';
import { Category } from './category.interface';
import { Comuna } from '@/mock/comunasVentas';
import { Client } from '@/app/(administrador)/admin/total-de-ventas/page';

export interface MetricCard {
  label: string;
  value: string | number;
  color: 'lime' | 'gray';
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
}

// Configuración base para tablas
export interface DashboardTableConfig {
  title: string;
  showTable: boolean;
  tableTitle: string;
}

// Configuración para gráficos
export interface ChartConfig {
  showMetricsChart?: boolean;
  showBottomChart?: boolean;
  metrics?: MetricCard[];
  bottomChartTitle?: string;
  bottomChartValue?: string;
}

// Configuración extendida que incluye propiedades opcionales
export interface ExtendedDashboardTableConfig extends DashboardTableConfig {
  showDatePicker?: boolean;
}

// Props principales del componente DashboardTableLayout
export interface DashboardTableLayoutProps<T = any> {
  config: ExtendedDashboardTableConfig;
  tableData?: T[];
  tableColumns?: TableColumn<T>[];
  productPaginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;

  // Configuración de gráficos (prop separada para mejor tipado)
  chartConfig?: ChartConfig;
  showDatePicker?: boolean;

  // Filtros básicos
  onFilter?: () => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onProviderFilter?: () => void;
  onSortBy?: (option: SortOption | null) => void;
  onCommuneFilter?: (selectedIds: string[]) => void;

  // Filtros específicos para gráficos
  onAmountFilter?: (amount: string) => void;
  onClientFilter?: (clientId: number) => void;

  // Datos para filtros
  categories?: Category[];
  communes?: Comuna[];
  clients?: Client[];

  // Estados de filtros seleccionados
  selectedCategories?: number[];
  selectedCommunes?: string[];
  selectedSortOption?: SortOption | null;
  selectedClients?: Client[];
  amountValue?: string;

  // Funciones de búsqueda
  onSearch?: (searchTerm: string) => void;
  onClearSearch?: () => void;
}

// Configuración legacy (mantener para compatibilidad si es necesario)
export interface DashboardConfig extends DashboardTableConfig {
  metrics: MetricCard[];
  showBottomChart?: boolean;
}

// Props legacy del DashboardLayout (mantener para referencia durante migración)
export interface DashboardLayoutProps<T = any> {
  config: DashboardConfig;
  tableData?: T[];
  tableColumns?: TableColumn<T>[];
  productPaginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onAmountFilter?: (amount: string) => void;
  onClientFilter?: (clientId: number) => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onFilter?: () => void;
  clients?: Client[];
  onProviderFilter?: () => void;
  onSortBy?: (option: SortOption | null) => void;
  categoryFilterOptions?: string[];
  providerFilterOptions?: string[];
  sortByOptions?: string[];
  categories?: Category[];
  onCommuneFilter?: (selectedIds: string[]) => void;
  communes?: Comuna[];
  amountValue?: string;
  selectedCategories?: number[];
  selectedCommunes?: string[];
  selectedSortOption?: SortOption | null;
  amountFilterOptions?: string[];
}
