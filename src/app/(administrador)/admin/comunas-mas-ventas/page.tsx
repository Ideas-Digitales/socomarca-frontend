'use client';

import { TableColumn } from '@/app/components/admin/CustomTable';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig } from '@/interfaces/dashboard.interface';
import { ComunaVenta, generarComunasVentas } from '@/mock/comunasVentas';
import { useState } from 'react';

export default function ComunasMasVentas() {
  const [comunasVenta] = useState(() => generarComunasVentas(20));

  const { changePage, paginatedItems, paginationMeta } =
    usePagination(comunasVenta);

  const config: DashboardConfig = {
    metrics: [
      {
        label: 'Comunas con más ventas',
        value: comunasVenta.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Comunas con más ventas',
  };

  const comunasVentasColumns: TableColumn<ComunaVenta>[] = [
    { key: 'comuna', label: 'Comuna' },
    { key: 'region', label: 'Región' },
    {
      key: 'venta',
      label: 'Venta',
      render: (value: number) => value,
    },
  ];

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={comunasVentasColumns}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando clientes...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
