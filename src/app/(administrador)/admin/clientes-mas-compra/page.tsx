'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig, TableColumn } from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import { useState } from 'react';

interface ClienteCompra {
  id: string;
  cliente: string;
  monto: number;
  fecha: string;
  acciones: string;
}

export default function ClientesMasCompra() {
  const [clientes] = useState(() => generarTransaccionesAleatorias(100));
  const clientesFixed = clientes.map((cliente) => ({
    id: String(cliente.id),
    cliente: cliente.cliente,
    monto: cliente.monto,
    fecha: cliente.fecha,
    acciones: cliente.acciones,
  }));

  const { paginatedItems, paginationMeta, changePage } =
    usePagination(clientesFixed);

  const config: DashboardConfig = {
    title: 'Clientes con más compras',
    metrics: [
      {
        label: 'Clientes con más compras',
        value: clientesFixed.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Clientes con más compras',
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

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={clientesColumns}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando clientes...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
