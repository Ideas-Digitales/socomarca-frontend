'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  AmountRange,
} from '@/interfaces/dashboard.interface';
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

export default function TotalDeVentas() {
  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Total de compradores',
      value: '850',
      color: 'lime',
    },
    {
      label: 'Total de compradores',
      value: '850',
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: true,
    metrics: metrics,
    bottomChartTitle: 'Total de ingresos',
    bottomChartValue: '20.000.000',
  };

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = {
    title: 'Total de ventas',
    showTable: true,
    tableTitle: 'Total de ventas',
    showDatePicker: true,
  };

  const handleAmountFilter = (amount: AmountRange) => {
    console.log('Filtrar por rango de montos:', amount);
    setAmountFilter(amount);
  };

  const handleClientFilter = (clientId: number) => {
    console.log('Filtrar por cliente:', clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClients([client]);
    }
  };

  const handleFilter = () => {
    console.log('Aplicar filtros generales...');
    // Aquí puedes implementar la lógica de filtros generales
  };

  const handleClearSearch = () => {
    console.log('Limpiar búsqueda');
    // Implementar lógica para limpiar búsqueda
  };

  return (
    <DashboardTableLayout
      config={config}
      // Props para gráficos (se pasan directamente)
      chartConfig={chartConfig}
      showDatePicker={true}
      // Filtros específicos
      onAmountFilter={handleAmountFilter}
      onClientFilter={handleClientFilter}
      onFilter={handleFilter}
      // Datos para filtros
      clients={clients}
      selectedClients={selectedClients}
      amountValue={amountFilter}
      searchableDropdown={true}
      // Funciones de búsqueda
      onClearSearch={handleClearSearch}
    />
  );
}
