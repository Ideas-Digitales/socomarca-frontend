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

interface ClienteCompra {
  id: string;
  cliente: string;
  monto: number;
  fecha: string;
  acciones: string;
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

export default function ClientesMasCompra() {
  const [clientes] = useState(() => generarTransaccionesAleatorias(100));

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<string>('');

  const clientesFixed = clientes.map((cliente) => ({
    id: String(cliente.id),
    cliente: cliente.cliente,
    monto: cliente.monto,
    fecha: cliente.fecha,
    acciones: cliente.acciones,
  }));

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(clientesFixed);

  // Calcular total de compras para métricas
  const totalCompras = clientesFixed.reduce(
    (sum, cliente) => sum + cliente.monto,
    0
  );

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Clientes con más compras',
      value: clientesFixed.length,
      color: 'lime',
    },
    {
      label: 'Valor total en compras',
      value: `$${totalCompras.toLocaleString()}`,
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
    title: 'Clientes con más compras',
    showTable: true,
    tableTitle: 'Clientes con más compras',
    showDatePicker: true, // Habilitar el selector de fechas
  };

  // Columnas específicas para clientes
  const clientesColumns: TableColumn<ClienteCompra>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: 'fecha', label: 'Fecha' },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => value,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: string) => <div className="text-lime-500">{value}</div>,
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
      tableColumns={clientesColumns}
      productPaginationMeta={productPaginationMeta}
      onPageChange={changePage}
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
      // Funciones de búsqueda
      onClearSearch={handleClearSearch}
    />
  );
}
