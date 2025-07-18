'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
} from '@/interfaces/dashboard.interface';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';
import { formatCurrency } from '@/utils/formatCurrency';

interface ProductoFormatted {
  id: string;
  product: string;
  month: string;
  total: number;
}

export interface Client {
  id: number;
  name: string;
}

// Mock clients - estos pueden ser removidos cuando haya filtrado real
const clients: Client[] = [
  { id: 1, name: 'Cliente 1' },
  { id: 2, name: 'Cliente 2' },
  { id: 3, name: 'Cliente 3' },
  { id: 4, name: 'Cliente 4' },
];

export default function ProductosMasVentas() {
  // Store hooks
  const {
    topProductsData,
    isLoadingTopProducts,
    fetchTopProducts,
    clearTopProducts,
    reportsFilters,
    setReportsFilters,
    clearReportsFilters,
    // Chart loading
    isLoadingChart,
  } = useStore();

  // Estados para manejar filtros
  // const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    clearReportsFilters();
    const start = '';
    const end = '';
    
    // Cargar datos de productos
    fetchTopProducts(start, end, undefined, undefined, undefined, undefined).finally(() => {
      setIsInitialLoad(false);
    });

    // Cleanup: limpiar datos cuando el componente se desmonta
    return () => {
      clearTopProducts();
    };
  }, [fetchTopProducts, clearReportsFilters, clearTopProducts]);

  // Transformar datos para la tabla
  const productosFormatted: ProductoFormatted[] = topProductsData?.top_products?.map(
    (item, index) => ({
      id: String(index + 1),
      product: item.product,
      month: item.month,
      total: item.total,
    })
  ) || [];

  // Definir las métricas basadas en datos del backend
  const metrics: MetricCard[] = [
    {
      label: 'Productos con más ventas',
      value: productosFormatted.length,
      color: 'lime',
    },
    {
      label: 'Total en ventas',
      value: formatCurrency(topProductsData?.total_sales || 0),
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true, // Mostrar el gráfico principal con métricas
    showBottomChart: false, // Mostrar el gráfico inferior
    metrics: metrics,
  };

  // Configuración del dashboard (usando ExtendedDashboardTableConfig)
  const config: ExtendedDashboardTableConfig = {
    title: 'Productos con más ventas',
    showTable: true,
    tableTitle: 'Productos con más ventas',
    showDatePicker: true, // Habilitar el selector de fechas
  };

  // Columnas para productos
  const productosColumns: TableColumn<ProductoFormatted>[] = [
    { key: 'product', label: 'Producto' },
    { key: 'month', label: 'Mes' },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => formatCurrency(value),
    },
  ];

  // const handleCategoryFilter = (categoryIds: number[]) => {
  //   setSelectedCategories(categoryIds);
  //   setReportsFilters({ selectedCategory: categoryIds.length > 0 ? String(categoryIds[0]) : undefined });
  // };

  const handleFilter = () => {
    // Aplicar filtros cuando estén implementados
    const { start, end, selectedClient, selectedCategory, total_min, total_max } = reportsFilters;
    fetchTopProducts(start, end, selectedClient, selectedCategory, total_min, total_max);
  };

  const handleClearSearch = () => {
    // setSelectedClients([]);
    // setSelectedCategories([]);
    setAmountFilter({ min: '', max: '' });
    
    // Limpiar filtros del store
    clearReportsFilters();
    
    // Recargar datos sin filtros
    clearTopProducts();
    fetchTopProducts('', '', undefined, undefined, undefined, undefined);
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    setReportsFilters({ start, end });
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if ((isLoadingTopProducts || isLoadingChart) && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando datos de productos...</p>
      </div>
    );
  }



  return (
    <div className="relative">
      <DashboardTableLayout
        config={config}
        tableData={productosFormatted}
        tableColumns={productosColumns}
        productPaginationMeta={undefined} // Sin paginación por ahora
        onPageChange={() => {}} // Sin paginación por ahora
        chartConfig={chartConfig}
        showDatePicker={true}
        // NO ESTA FUNCIONANDO
        // onAmountFilter={handleAmountFilter}
        // onCategoryFilter={handleCategoryFilter}
        // NO ESTA FUNCIONANDO
        onFilter={handleFilter}
        clients={clients}
        // selectedCategories={selectedCategories}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: reportsFilters.start || undefined,
          end: reportsFilters.end || undefined,
        }}
        isLoadingChart={isLoadingChart}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {(isLoadingTopProducts || isLoadingChart) && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">
              {isLoadingTopProducts && isLoadingChart ? 'Actualizando datos y gráficos...' :
               isLoadingTopProducts ? 'Actualizando datos...' : 'Actualizando gráficos...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
