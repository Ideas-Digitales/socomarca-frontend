'use client';

import DashboardLayout, {
  TableColumn,
} from '@/app/components/dashboard/DashboardLayout';
import { usePagination } from '@/hooks/usePagination';
import { DashboardConfig } from '@/interfaces/dashboard.interface';
import { useState } from 'react';

interface ProductoVenta {
  id: string;
  nombre: string;
  categoria: string;
  cantidadVendida: number;
  precio: number;
  ingresoTotal: number;
  stock: number;
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado';
}

export default function ProductosMasVentas() {
  const [clientes] = useState<ProductoVenta[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: `producto-${i + 1}`,
      nombre: `Producto ${i + 1}`,
      categoria: `Categoría ${Math.floor(Math.random() * 5) + 1}`,
      cantidadVendida: Math.floor(Math.random() * 100) + 1,
      precio: Math.floor(Math.random() * 1000) + 100,
      ingresoTotal: Math.floor(Math.random() * 100000) + 10000,
      stock: Math.floor(Math.random() * 200) + 10,
      estado:
        Math.random() < 0.5
          ? 'Disponible'
          : Math.random() < 0.5
          ? 'Bajo Stock'
          : 'Agotado',
    }))
  );

  const { paginatedItems, paginationMeta, changePage } =
    usePagination(clientes);

  const config: DashboardConfig = {
    metrics: [
      {
        label: 'Clientes con más compras',
        value: clientes.length,
        color: 'lime',
      },
    ],
    showTable: true,
    tableTitle: 'Clientes con Más Compras',
  };
  const productosVentasColumns: TableColumn<ProductoVenta>[] = [
    { key: 'nombre', label: 'Nombre del Producto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'cantidadVendida', label: 'Cantidad Vendida' },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'ingresoTotal',
      label: 'Ingreso Total',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { key: 'stock', label: 'Stock' },
    { key: 'estado', label: 'Estado' },
  ];

  return (
    <DashboardLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={productosVentasColumns}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onDownload={() => console.log('Descargando clientes...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
