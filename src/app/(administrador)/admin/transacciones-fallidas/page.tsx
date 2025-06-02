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
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import useStore from '@/stores/base';
import { useState } from 'react';

interface TransaccionFallida {
  id: string;
  cliente: string;
  monto: number;
  fecha: string;
  tipo: 'fallida' | 'cancelada';
  razon: string;
  carrito: string;
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

// Razones comunes de fallas
const razonesFalla = [
  'Tarjeta rechazada',
  'Fondos insuficientes',
  'Cancelado por usuario',
  'Error de red',
  'Tiempo agotado',
  'Datos incorrectos',
];

export default function TransaccionesFallidas() {
  const { categories } = useStore();
  // Generar datos simulados de transacciones fallidas
  const [transacciones] = useState(() => {
    const transaccionesBase = generarTransaccionesAleatorias(100);
    return transaccionesBase.map((transaccion, index) => ({
      id: String(transaccion.id),
      cliente: transaccion.cliente,
      monto: transaccion.monto,
      fecha: transaccion.fecha,
      tipo:
        Math.random() > 0.7
          ? 'cancelada'
          : ('fallida' as 'fallida' | 'cancelada'),
      razon: razonesFalla[Math.floor(Math.random() * razonesFalla.length)],
      carrito: `#${20 + index}`, // Simular números de carrito
    }));
  });

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(transacciones);

  // Calcular métricas específicas para transacciones fallidas
  const totalFallidas = transacciones.filter(
    (t) => t.tipo === 'fallida'
  ).length;
  const totalCanceladas = transacciones.filter(
    (t) => t.tipo === 'cancelada'
  ).length;
  const montoTotalPerdido = transacciones.reduce((sum, t) => sum + t.monto, 0);

  // Definir las métricas
  const metrics: MetricCard[] = [
    {
      label: 'Total fallidas',
      value: totalFallidas,
      color: 'lime',
    },
    {
      label: 'Total canceladas',
      value: totalCanceladas,
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: false, // Mostrar el gráfico principal con métricas
    showBottomChart: true, // Mostrar el gráfico inferior
    metrics: metrics,
    bottomChartTitle: 'Monto total perdido',
    bottomChartValue: `$${montoTotalPerdido.toLocaleString()}`,
  };

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = {
    title: 'Transacciones Fallidas',
    showTable: false,
    tableTitle: 'Historial de Transacciones Fallidas',
    showDatePicker: true, // Habilitar el selector de fechas
  };

  // Columnas para transacciones fallidas
  const transaccionesFallidasColumns: TableColumn<TransaccionFallida>[] = [
    { key: 'carrito', label: 'Carrito' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: 'fecha', label: 'Fecha' },
    {
      key: 'tipo',
      label: 'Estado',
      render: (value: 'fallida' | 'cancelada') => (
        <span
          className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${
            value === 'fallida'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }
        `}
        >
          {value === 'fallida' ? 'Fallida' : 'Cancelada'}
        </span>
      ),
    },
    {
      key: 'razon',
      label: 'Razón',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
  ];

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

  const handleCategoryFilter = (categoryIds: number[]) => {
    console.log('Filtrar por categorías (tipo de falla):', categoryIds);
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
      tableColumns={transaccionesFallidasColumns}
      productPaginationMeta={productPaginationMeta}
      onPageChange={changePage}
      categories={categories}
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
