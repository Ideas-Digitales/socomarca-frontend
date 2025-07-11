'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { usePagination } from '@/hooks/usePagination';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
} from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';
import { useState, useEffect } from 'react';

interface CategoriaConRanking {
  categoria: string;
  venta: number;
  ranking: number;
}

export interface Client {
  id: number;
  name: string;
}

const clients: Client[] = [
  { id: 1, name: 'Cliente 1' },
  { id: 2, name: 'Cliente 2' },
  { id: 3, name: 'Cliente 3' },
  { id: 4, name: 'Cliente 4' },
];

export default function CategoriasMasVentas() {
  // Store hooks
  const {
    topCategoriesData,
    isLoadingTopCategories,
    fetchTopCategories,
    clearTopCategories,
    // Agregar los hooks necesarios para los gráficos
    fetchChartReports,
    fetchChartRawData,
    clearChartReports,
    isLoadingChart,
    setReportsFilters,
    reportsFilters,
    clearReportsFilters,
  } = useStore();

  // Estados para manejar filtros
  // const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  // const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: reportsFilters.total_min?.toString() || '',
    max: reportsFilters.total_max?.toString() || '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sincronizar el estado local del filtro de monto con los filtros del store
  useEffect(() => {
    setAmountFilter({
      min: reportsFilters.total_min?.toString() || '',
      max: reportsFilters.total_max?.toString() || '',
    });
  }, [reportsFilters.total_min, reportsFilters.total_max]);

  // Procesar datos de top categories para crear ranking
  const categoriasConRanking: CategoriaConRanking[] = (() => {
    if (!topCategoriesData?.top_categories) return [];
    
    // Agrupar por categoría y sumar totales
    const categorySummary = topCategoriesData.top_categories.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.total;
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir a array y ordenar por total
    const sortedCategories = Object.entries(categorySummary)
      .map(([categoria, venta]) => ({ categoria, venta }))
      .sort((a, b) => b.venta - a.venta);
    
    // Agregar ranking
    return sortedCategories.map((cat, idx) => ({
      categoria: cat.categoria,
      venta: cat.venta,
      ranking: idx + 1,
    }));
  })();

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(categoriasConRanking);

  // Cargar datos iniciales
  useEffect(() => {
    clearReportsFilters();
    const start = '';
    const end = '';
    
    // Cargar datos iniciales usando Promise.all
    Promise.all([
      fetchTopCategories(start, end),
      fetchChartReports(start, end, 'top-categories'),
      fetchChartRawData(start, end, null)
    ]).finally(() => {
      setIsInitialLoad(false);
    });

    // Cleanup: limpiar datos cuando el componente se desmonta
    return () => {
      clearTopCategories();
      clearChartReports();
    };
  }, [fetchTopCategories, clearTopCategories, fetchChartReports, fetchChartRawData, clearChartReports, clearReportsFilters]);

  // Debug: Log de datos cuando cambien (solo para desarrollo)
  useEffect(() => {
    if (topCategoriesData) {
      console.log('Datos de top categories recibidos:', topCategoriesData);
      console.log('Categorías procesadas:', categoriasConRanking);
    }
  }, [topCategoriesData, categoriasConRanking]);

  // Calcular totales para métricas
  const totalVentas = categoriasConRanking.reduce(
    (sum, categoria) => sum + categoria.venta,
    0
  );

  const promedioVentas = categoriasConRanking.length > 0 ? totalVentas / categoriasConRanking.length : 0;

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Categorías con más ventas',
      value: categoriasConRanking.length,
      color: 'lime',
    },
    {
      label: 'Promedio de ventas',
      value: (() => {
        // Usar el promedio del backend si está disponible, sino calcular local
        if (topCategoriesData?.average_sales) {
          return `$${topCategoriesData.average_sales.toLocaleString()}`;
        }
        return `$${promedioVentas.toLocaleString()}`;
      })(),
      color: 'gray',
    },
    {
      label: 'Total de ventas',
      value: (() => {
        // Usar el total del backend si está disponible, sino calcular local
        if (topCategoriesData?.total_sales) {
          return `$${topCategoriesData.total_sales.toLocaleString()}`;
        }
        return `$${totalVentas.toLocaleString()}`;
      })(),
      color: 'lime',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: false,
    metrics: metrics,
  };

  const config: ExtendedDashboardTableConfig = {
    title: 'Categorías con más ventas',
    showTable: true,
    tableTitle: 'Categorías con más ventas',
    showDatePicker: true,
  };

  const categoriasVentasColumns: TableColumn<CategoriaConRanking>[] = [
    {
      key: 'ranking',
      label: 'Ranking',
      render: (value: number) => `${value}`,
    },
    {
      key: 'categoria',
      label: 'Categoría',
    },
    {
      key: 'venta',
      label: 'Ventas',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  const handleAmountFilter = (amount: AmountRange) => {
    console.log('Filtrar por rango de montos:', amount);
    setAmountFilter(amount);
    
    // Convertir los valores de string a number para el backend
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    
    // Actualizar filtros en el store
    setReportsFilters({ total_min, total_max });
  };

  // TEMPORAL: Actualizar para manejar tanto number como string
  // const handleClientFilter = (clientId: number | string) => {
  //   console.log('Filtrar por cliente:', clientId, typeof clientId);

  //   if (typeof clientId === 'string') {
  //     // TEMPORAL: Nuevo comportamiento - usar el string directamente
  //     if (clientId.trim() === '') {
  //       // Limpiar selección
  //       // setSelectedClients([]);
  //     } else {
  //       // setSelectedClients([{ id: 0, name: clientId }]); // ID temporal para mantener compatibilidad
  //     }
  //   } else {
  //     // TEMPORAL: Comportamiento original para números (comentado para referencia)
  //     // if (clientId === -1 || clientId === 0) {
  //     //   // Limpiar selección
  //     //   setSelectedClients([]);
  //     // } else {
  //     //   const client = clients.find((c) => c.id === clientId);
  //     //   if (client) {
  //     //     setSelectedClients([client]);
  //     //   }
  //     // }
  //   }
  // };

  // const handleCategoryFilter = (categoryIds: number[]) => {
  //   console.log('Filtrar por categorías:', categoryIds);
  //   // setSelectedCategories(categoryIds);
  // };

  const handleFilter = () => {
    console.log('Aplicar filtros generales...');

    // Obtener todos los filtros del store
    const { start, end, total_min, total_max } = reportsFilters;
    console.log('Filtros del store:', { start, end, total_min, total_max });

    // Recargar todos los datos con los filtros
    Promise.all([
      fetchTopCategories(start, end, total_min, total_max), // Modificar para pasar los filtros
      fetchChartReports(start, end, 'top-categories'),
      fetchChartRawData(start, end, null)
    ]);

    // Ejemplo de lógica de filtrado usando el rango de montos
    let filteredCategories = categoriasConRanking;

    // Filtrar por rango de montos si se especifica
    if (total_min || total_max) {
      const minAmount = total_min || 0;
      const maxAmount = total_max || Infinity;

      filteredCategories = filteredCategories.filter(
        (categoria) =>
          categoria.venta >= minAmount && categoria.venta <= maxAmount
      );
    }

    console.log('Categorías filtradas:', filteredCategories);
  };

  const handleClearSearch = () => {
    console.log('Limpiar búsqueda');
    setAmountFilter({ min: '', max: '' });
    // setSelectedClients([]);
    // setSelectedCategories([]);
    
    // Limpiar filtros en el store
    setReportsFilters({
      start: '',
      end: '',
      selectedClient: undefined,
      selectedCategory: undefined,
      type: null,
      total_min: undefined,
      total_max: undefined,
    });
    
    // Usar fechas por defecto en lugar de fechas vacías
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const start = startOfMonth.toISOString().split('T')[0];
    const end = endOfMonth.toISOString().split('T')[0];
    
    // Limpiar filtros y recargar datos
    clearTopCategories();
    Promise.all([
      fetchTopCategories(start, end),
      fetchChartReports(start, end, 'top-categories'),
      fetchChartRawData(start, end, null)
    ]);
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    Promise.all([
      fetchTopCategories(start, end),
      fetchChartReports(start, end, 'top-categories'),
      fetchChartRawData(start, end, null)
    ]);
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if (isLoadingTopCategories && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando categorías con más ventas...</p>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay datos
  if (!isLoadingTopCategories && !isInitialLoad && categoriasConRanking.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay categorías</h3>
        <p className="text-gray-600 text-sm">No se encontraron categorías con ventas en el período seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vista principal */}
      <DashboardTableLayout
        config={config}
        // Datos de la tabla
        tableData={paginatedItems}
        tableColumns={categoriasVentasColumns}
        productPaginationMeta={productPaginationMeta}
        onPageChange={changePage}
        // Props para gráficos (se pasan directamente)
        chartConfig={chartConfig}
        showDatePicker={true}
        // Filtros específicos
        onAmountFilter={handleAmountFilter}
        onFilter={handleFilter}
        // Datos para filtros
        clients={clients}
        amountValue={amountFilter}
        // Funciones de búsqueda
        searchableDropdown={true}
        onClearSearch={handleClearSearch}
        // Callback para el DatePicker
        onDateRangeChange={handleDateRangeChange}
        // Estado de carga del gráfico
        isLoadingChart={isLoadingChart}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {(isLoadingTopCategories || isLoadingChart) && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">
              {isLoadingTopCategories && isLoadingChart ? 'Actualizando datos y gráficos...' :
               isLoadingTopCategories ? 'Actualizando categorías...' : 'Actualizando gráficos...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
 }