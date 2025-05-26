'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { usePagination } from '@/hooks/usePagination';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import useStore from '@/stores/base';
import { useState } from 'react';

interface Producto {
  id: string;
  producto: string;
  SKU: string;
  categoria: string;
  proveedor: string;
  precio_unitario: number;
  stock: number;
}

export default function ProductsAdmin() {
  const { categories } = useStore();
  const [productos] = useState(() => generarTransaccionesAleatorias(100));
  const productosFixed = productos.map((producto) => ({
    id: String(producto.id),
    producto: producto.cliente,
    SKU: `SKU-${producto.id}`,
    categoria: `Categoría ${Math.ceil(Math.random() * 10)}`,
    proveedor: `Proveedor ${Math.ceil(Math.random() * 5)}`,
    precio_unitario: producto.monto,
    stock: Math.floor(Math.random() * 1000),
  }));
  const { paginatedItems, paginationMeta, changePage } =
    usePagination(productosFixed);
  const config: DashboardTableConfig = {
    title: 'Productos',
    showTable: true,
    tableTitle: 'Productos',
  };

  const productosColumns: TableColumn<Producto>[] = [
    { key: 'id', label: 'ID' },
    { key: 'producto', label: 'Producto' },
    { key: 'SKU', label: 'SKU' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'proveedor', label: 'Proveedor' },
    {
      key: 'precio_unitario',
      label: 'Precio Unitario',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: 'stock', label: 'Stock' },
  ];

  return (
    <>
      <DashboardTableLayout
        config={config}
        tableData={paginatedItems}
        tableColumns={productosColumns}
        paginationMeta={paginationMeta}
        onPageChange={changePage}
        onFilter={() => console.log('Filter clicked')}
        onCategoryFilter={() => console.log('Category filter clicked')}
        onProviderFilter={() => console.log('Provider filter clicked')}
        onSortBy={() => console.log('Sort by clicked')}
        categories={categories}
      />
    </>
  );
}
