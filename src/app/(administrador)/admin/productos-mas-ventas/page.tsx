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
  } = useStore();

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    const start = '';
    const end = '';
    
    fetchTopProducts(start, end).finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchTopProducts]);

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
      value: `$${(topProductsData?.total_sales || 0).toLocaleString()}`,
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
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  // Handlers para los filtros
  const handleAmountFilter = (amount: AmountRange) => {
    setAmountFilter(amount);
    // Nota: Los filtros específicos podrían implementarse en el backend en el futuro
  };

  const handleClientFilter = (clientId: number) => {
    if (clientId === -1 || clientId === 0) {
      setSelectedClients([]);
    } else {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClients([client]);
      }
    }
  };

  const handleCategoryFilter = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
  };

  const handleFilter = () => {
    // Aplicar filtros cuando estén implementados
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setSelectedCategories([]);
    setAmountFilter({ min: '', max: '' });
    
    // Recargar datos sin filtros
    clearTopProducts();
    fetchTopProducts('', '');
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    fetchTopProducts(start, end);
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if (isLoadingTopProducts && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando datos de productos...</p>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay datos
  if (!isLoadingTopProducts && !isInitialLoad && productosFormatted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay datos de productos</h3>
        <p className="text-gray-600 text-sm">No se encontraron datos con los filtros actuales.</p>
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
        onAmountFilter={handleAmountFilter}
        onClientFilter={handleClientFilter}
        onCategoryFilter={handleCategoryFilter}
        onFilter={handleFilter}
        clients={clients}
        selectedClients={selectedClients}
        selectedCategories={selectedCategories}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: undefined,
          end: undefined,
        }}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {isLoadingTopProducts && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">Actualizando datos...</span>
          </div>
        </div>
      )}
    </div>
  );
}
