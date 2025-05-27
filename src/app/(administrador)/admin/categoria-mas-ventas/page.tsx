'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig, TableColumn } from '@/interfaces/dashboard.interface';
import {
  generarTransaccionesAleatorias,
  agruparVentasPorCategoria,
} from '@/mock/transaccionesExitosas';
import { useState } from 'react';

interface CategoriaConRanking {
  categoria: string;
  venta: number;
  ranking: number;
}

export default function CategoriasMasVentas() {
  const transacciones = useState(() => generarTransaccionesAleatorias(100))[0];
  const categorias = agruparVentasPorCategoria(transacciones);

  const categoriasConRanking: CategoriaConRanking[] = categorias.map(
    (cat, idx) => ({
      categoria: cat.categoria,
      venta: cat.venta,
      ranking: idx + 1,
    })
  );

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(categoriasConRanking);

  const config: DashboardConfig = {
    title: 'Categorías con más ventas',
    metrics: [
      {
        label: 'Categorías con más ventas',
        value: categorias.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Categorías con más ventas',
  };

  const categoriasVentasColumns: TableColumn<CategoriaConRanking>[] = [
    {
      key: 'ranking',
      label: 'Ranking',
      render: (_: any, row) => `${row.ranking}`,
    },
    {
      key: 'categoria',
      label: 'Categoría',
    },
    {
      key: 'venta',
      label: 'Ventas',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={categoriasVentasColumns}
      productPaginationMeta={productPaginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargar categorías...')}
      onCategoryFilter={() => console.log('Filtrar por categoría...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
