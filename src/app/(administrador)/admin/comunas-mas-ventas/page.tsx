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
import { ComunaVenta, generarComunasVentas } from '@/mock/comunasVentas';
import { useState } from 'react';

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

export default function ComunasMasVentas() {
  const [comunasVenta] = useState(() => generarComunasVentas(20));

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });

  const { changePage, paginatedItems, productPaginationMeta } =
    usePagination(comunasVenta);

  // Calcular totales para métricas
  const totalVentas = comunasVenta.reduce(
    (sum, comuna) => sum + comuna.venta,
    0
  );

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Comunas con más ventas',
      value: comunasVenta.length,
      color: 'lime',
    },
    {
      label: 'Total ventas por comuna',
      value: `$${totalVentas.toLocaleString()}`,
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: false,
    metrics: metrics,
  };

  // Configuración del dashboard (usando ExtendedDashboardTableConfig)
  const config: ExtendedDashboardTableConfig = {
    title: 'Comunas con más ventas',
    showTable: true,
    tableTitle: 'Comunas con más ventas',
    showDatePicker: true,
  };

  // Columnas específicas para comunas
  const comunasVentasColumns: TableColumn<ComunaVenta>[] = [
    { key: 'comuna', label: 'Comuna' },
    { key: 'region', label: 'Región' },
    {
      key: 'venta',
      label: 'Venta',
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

  const handleCommuneFilter = (communeIds: string[]) => {
    console.log('Filtrar por comunas:', communeIds);
    setSelectedCommunes(communeIds);
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
      tableColumns={comunasVentasColumns}
      productPaginationMeta={productPaginationMeta}
      onPageChange={changePage}
      // Props para gráficos (se pasan directamente)
      chartConfig={chartConfig}
      showDatePicker={true}
      // Filtros específicos
      onAmountFilter={handleAmountFilter}
      onClientFilter={handleClientFilter}
      onCommuneFilter={handleCommuneFilter}
      onFilter={handleFilter}
      // Datos para filtros
      clients={clients}
      communes={comunasVenta} // Usar las comunas reales como opciones de filtro
      selectedClients={selectedClients}
      selectedCommunes={selectedCommunes}
      amountValue={amountFilter}
      // Funciones de búsqueda
      onClearSearch={handleClearSearch}
      searchableDropdown={true}
    />
  );
}
