'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig } from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import { useState } from 'react';

export default function ClientesMasCompra() {
  const [transacciones] = useState(() => generarTransaccionesAleatorias(100));
  const { paginatedItems, paginationMeta, changePage } =
    usePagination(transacciones);

  const config: DashboardConfig = {
    metrics: [
      {
        label: 'Clientes con más compras',
        value: transacciones.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Cliente(s) con más compra',
  };

  return (
    <DashboardLayout
      config={config}
      transacciones={paginatedItems}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando datos...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
