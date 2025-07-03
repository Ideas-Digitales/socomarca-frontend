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
  } = useStore();

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    fetchTopCategories('', '').finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchTopCategories]);

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


  };

  const handleClientFilter = (clientId: number) => {
    console.log('Filtrar por cliente:', clientId);

    if (clientId === -1 || clientId === 0) {
      // Limpiar selección
      setSelectedClients([]);
    } else {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClients([client]);
      }
    }
  };

  const handleCategoryFilter = (categoryIds: number[]) => {
    console.log('Filtrar por categorías:', categoryIds);
    setSelectedCategories(categoryIds);
  };

  const handleFilter = () => {
    console.log('Aplicar filtros generales...');

    // Ejemplo de lógica de filtrado usando el rango de montos
    let filteredCategories = categoriasConRanking;

    // Filtrar por rango de montos si se especifica
    if (amountFilter.min || amountFilter.max) {
      const minAmount = amountFilter.min ? parseFloat(amountFilter.min) : 0;
      const maxAmount = amountFilter.max
        ? parseFloat(amountFilter.max)
        : Infinity;

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
    setSelectedClients([]);
    setSelectedCategories([]);
    
    // Limpiar filtros y recargar datos
    clearTopCategories();
    fetchTopCategories('', '');
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    fetchTopCategories(start, end);
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
        onClientFilter={handleClientFilter}
        onCategoryFilter={handleCategoryFilter}
        onFilter={handleFilter}
        // Datos para filtros
        clients={clients}
        selectedClients={selectedClients}
        selectedCategories={selectedCategories}
        amountValue={amountFilter}
        // Funciones de búsqueda
        searchableDropdown={true}
        onClearSearch={handleClearSearch}
        // Callback para el DatePicker
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {isLoadingTopCategories && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">Actualizando categorías...</span>
          </div>
        </div>
             )}
     </div>
   );
 }

 /*
   IMPLEMENTACIÓN COMPLETADA - TOP CATEGORIES ENDPOINT
   
   Este componente ahora usa el endpoint "top-categories" para:
   - Obtener datos reales de categorías con más ventas
   - Mostrar métricas actualizadas (total de categorías, promedio de ventas, total de ventas)
   - Permitir filtrado por rango de fechas
   - Mostrar datos agrupados por categoría con ranking
   
   Datos disponibles en topCategoriesData:
   - top_categories: Array con { month, category, total }
   - total_sales: Total de ventas de todas las categorías
   - average_sales: Promedio de ventas por categoría
   
   La vista procesa los datos para:
   1. Agrupar por categoría (sumando ventas de todos los meses)
   2. Ordenar por total de ventas (descendente)
   3. Asignar ranking
   4. Mostrar en tabla paginada
 */
