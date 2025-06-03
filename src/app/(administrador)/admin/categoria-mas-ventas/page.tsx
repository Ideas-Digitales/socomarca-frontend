'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { usePagination } from '@/hooks/usePagination';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
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
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });

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
      searchableDropdown={true}
      onClearSearch={handleClearSearch}
    />
  );
}
