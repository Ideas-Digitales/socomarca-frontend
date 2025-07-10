import { PaginationMeta } from '@/stores/base/types';
import { CategoryComplexData } from './category.interface';
import { Comuna } from '@/mock/comunasVentas';
import { Client } from '@/app/(administrador)/admin/total-de-ventas/page';
import { Customer } from '@/services/actions/clients.actions';

// Interfaz para el rango de montos
export interface AmountRange {
  min: string;
  max: string;
}

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
  onAmountFilter?: (amount: AmountRange) => void;
  onClientFilter?: (clientId: number) => void;

  // Datos para filtros
  categories?: CategoryComplexData[];
  communes?: Comuna[];
  clients?: Client[];
  customers?: Customer[];

  // Estados de filtros seleccionados
  selectedCategories?: number[];
  selectedCommunes?: string[];
  selectedSortOption?: SortOption | null;
  selectedClients?: Client[];
  amountValue?: AmountRange;

  searchableDropdown?: boolean;

  // Funciones de búsqueda
  onSearch?: (searchTerm: string) => void;
  onClearSearch?: () => void;

  // Props para DatePicker
  onDateRangeChange?: (start: string, end: string) => void;
  initialDateRange?: {
    start?: string;
    end?: string;
  };
}
