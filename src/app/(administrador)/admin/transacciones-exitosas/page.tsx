'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig, TableColumn } from '@/interfaces/dashboard.interface';
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
}

export default function TransaccionesExitosas() {
  const [transacciones] = useState(() => generarTransaccionesAleatorias(100));
  const transaccionesFixed = transacciones.map(
    (transaccion: TransaccionExitosa) => ({
      id: String(transaccion.id),
      cliente: transaccion.cliente,
      monto1: transaccion.monto,
      monto2: transaccion.monto,
      monto3: transaccion.monto,
      fecha: transaccion.fecha,
      acciones: transaccion.acciones,
    })
  );

  const { paginatedItems, paginationMeta, changePage } =
    usePagination(transaccionesFixed);

  const config: DashboardConfig = {
    title: 'Transacciones Exitosas',
    metrics: [
      {
        label: 'Transacciones exitosas',
        value: transaccionesFixed.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Lista de Transacciones Exitosas',
  };

  // Definir columnas para transacciones (opcional - si no se pasa, usa las por defecto)
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
      render: (value: string) => <div className="text-lime-500">{value}</div>,
    },
  ];

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={transaccionesColumns}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando transacciones...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
