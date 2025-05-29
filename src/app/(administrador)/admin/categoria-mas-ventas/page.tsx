'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { usePagination } from '@/hooks/usePagination';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import {
  generarTransaccionesAleatorias,
  agruparVentasPorCategoria,
} from '@/mock/transaccionesExitosas';
import { useState } from 'react';

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
  const transacciones = useState(() => generarTransaccionesAleatorias(100))[0];
  const categorias = agruparVentasPorCategoria(transacciones);

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<string>('');

  const categoriasConRanking: CategoriaConRanking[] = categorias.map(
    (cat, idx) => ({
      categoria: cat.categoria,
      venta: cat.venta,
      ranking: idx + 1,
    })
  );

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(categoriasConRanking);

  // Calcular totales para métricas
  const totalVentas = categoriasConRanking.reduce(
    (sum, categoria) => sum + categoria.venta,
    0
  );

  const promedioVentas = totalVentas / categoriasConRanking.length;

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Categorías con más ventas',
      value: categorias.length,
      color: 'lime',
    },
    {
      label: 'Promedio de ventas',
      value: `$${promedioVentas.toLocaleString()}`,
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
    title: 'Categorías con más ventas',
    showTable: true,
    tableTitle: 'Categorías con más ventas',
    showDatePicker: true,
  };

  // Columnas específicas para categorías con ranking
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

  // Handlers para los filtros
  const handleAmountFilter = (amount: string) => {
    console.log('Filtrar por montos:', amount);
    setAmountFilter(amount);
  };

  const handleClientFilter = (clientId: number) => {
    console.log('Filtrar por cliente:', clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClients([client]);
    }
  };

  const handleCategoryFilter = (categoryIds: number[]) => {
    console.log('Filtrar por categorías:', categoryIds);
    setSelectedCategories(categoryIds);
  };

  const handleFilter = () => {
    console.log('Aplicar filtros generales...');
    // Implementar lógica de filtros generales
  };

  const handleClearSearch = () => {
    console.log('Limpiar búsqueda');
    // Implementar lógica para limpiar búsqueda
  };

  return (
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
      onClearSearch={handleClearSearch}
    />
  );
}
