'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import VerPedidoOverlay from '@/app/components/dashboardTable/VerPedidoOverlay';
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
  TransaccionExitosa,
} from '@/mock/transaccionesExitosas';
import { useState } from 'react';

interface TransaccionExitosaFormatted {
  id: string;
  cliente: string;
  monto1: number;
  monto2: number;
  monto3: number;
  fecha: string;
  acciones: string;
  originalData?: TransaccionExitosa;
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

export default function TransaccionesExitosas() {
  const [transacciones] = useState(() => generarTransaccionesAleatorias(100));

  // Estados para el overlay deslizante
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [detailSelected, setDetailSelected] =
    useState<TransaccionExitosa | null>(null);

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });

  const transaccionesFixed: TransaccionExitosaFormatted[] = transacciones.map(
    (transaccion: TransaccionExitosa) => ({
      id: String(transaccion.id),
      cliente: transaccion.cliente,
      monto1: transaccion.monto,
      monto2: transaccion.monto,
      monto3: transaccion.monto,
      fecha: transaccion.fecha,
      acciones: transaccion.acciones,
      originalData: transaccion,
    })
  );

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(transaccionesFixed);

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Transacciones exitosas',
      value: transaccionesFixed.length,
      color: 'lime',
    },
    {
      label: 'Valor total procesado',
      value: '$2,450,000',
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: false,
    metrics: metrics,
  };

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = {
    title: 'Transacciones Exitosas',
    showTable: true,
    tableTitle: 'Lista de Transacciones Exitosas',
    showDatePicker: true,
  };

  // Función para abrir el overlay con detalles
  const handleViewDetails = (transaccion: TransaccionExitosaFormatted) => {
    if (transaccion.originalData) {
      setDetailSelected(transaccion.originalData);
      setIsOverlayOpen(true);
    }
  };

  // Función para cerrar el overlay
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Pequeño delay para la animación antes de limpiar los datos
    setTimeout(() => {
      setDetailSelected(null);
    }, 300);
  };

  // Definir columnas para transacciones
  const transaccionesColumns: TableColumn<TransaccionExitosaFormatted>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto1',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'monto2',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'monto3',
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
      render: (value: string, row: TransaccionExitosaFormatted) => (
        <div
          onClick={() => handleViewDetails(row)}
          className="text-lime-500 cursor-pointer hover:text-lime-600 transition-colors"
        >
          {value}
        </div>
      ),
    },
  ];

  const handleAmountFilter = (amount: AmountRange) => {
    console.log('Filtrar por rango de montos:', amount);
    setAmountFilter(amount);
  };

  const handleClientFilter = (clientId: number) => {
    console.log('Filtrar por cliente:', clientId);
    if (clientId === -1 || clientId === 0) {
      setSelectedClients([]);
    } else {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClients([client]);
      }
    }
  };

  const handleFilter = () => {
    console.log('Aplicar filtros generales...');
  };

  const handleClearSearch = () => {
    console.log('Limpiar búsqueda');
  };

  return (
    <div className="relative">
      {/* Vista principal - siempre visible */}
      <DashboardTableLayout
        config={config}
        tableData={paginatedItems}
        tableColumns={transaccionesColumns}
        productPaginationMeta={productPaginationMeta}
        onPageChange={changePage}
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        onClientFilter={handleClientFilter}
        onFilter={handleFilter}
        clients={clients}
        selectedClients={selectedClients}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
      />

      {/* Overlay deslizante */}
      <VerPedidoOverlay
        isOpen={isOverlayOpen}
        detailSelected={detailSelected}
        onClose={handleCloseOverlay}
      />
    </div>
  );
}
