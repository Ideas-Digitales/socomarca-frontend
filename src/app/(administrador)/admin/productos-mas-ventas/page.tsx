'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig, TableColumn } from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import { useState } from 'react';

interface ProductoVenta {
  id: string;
  productos: string;
  subtotal: number;
  margen: number;
  venta: number;
}

export default function ProductosMasVentas() {
  const [productos] = useState(() => generarTransaccionesAleatorias(100));
  const productosFixed = productos.map((producto) => ({
    id: String(producto.id),
    productos: producto.cliente,
    subtotal: producto.monto,
    margen: producto.monto,
    venta: producto.monto,
  }));

  const { paginatedItems, productPaginationMeta, changePage } =
    usePagination(productosFixed);

  const config: DashboardConfig = {
    title: 'Productos con más ventas',
    metrics: [
      {
        label: 'Productos con más ventas',
        value: productos.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Productos con más ventas',
  };
  const productosVentasColumns: TableColumn<ProductoVenta>[] = [
    { key: 'productos', label: 'Productos' },
    {
      key: 'subtotal',
      label: 'Subtotal',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'margen',
      label: 'Margen',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'venta',
      label: 'Venta',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={productosVentasColumns}
      productPaginationMeta={productPaginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando clientes...')}
      onCategoryFilter={() => console.log('Filtrar por categorias...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
