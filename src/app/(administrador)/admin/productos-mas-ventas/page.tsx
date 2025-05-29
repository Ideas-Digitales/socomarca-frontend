'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { usePagination } from '@/hooks/usePagination';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import { useState } from 'react';

interface ProductoVenta {
  id: string;
  productos: string;
  subtotal: number;
  margen: number;
  venta: number;
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

export default function ProductosMasVentas() {
  const [productos] = useState(() => generarTransaccionesAleatorias(100));

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<string>('');

  const productosFixed = productos.map((producto) => ({
    id: String(producto.id),
    productos: producto.cliente,
    subtotal: producto.monto,
    margen: producto.monto * 0.3, // 30% de margen como ejemplo
    venta: producto.monto,
  }));

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(productosFixed);

  // Calcular totales para métricas
  const totalVentas = productosFixed.reduce(
    (sum, producto) => sum + producto.venta,
    0
  );

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Productos con más ventas',
      value: productosFixed.length,
      color: 'lime',
    },
    {
      label: 'Total en ventas',
      value: `$${totalVentas.toLocaleString()}`,
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

  // Columnas específicas para productos
  const productosVentasColumns: TableColumn<ProductoVenta>[] = [
    { key: 'productos', label: 'Productos' },
    {
      key: 'subtotal',
      label: 'Subtotal',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'margen',
      label: 'Margen',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'venta',
      label: 'Venta',
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
      tableColumns={productosVentasColumns}
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
