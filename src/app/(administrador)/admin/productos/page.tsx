'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { usePagination } from '@/hooks/usePagination';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { generarTransaccionesAleatorias } from '@/mock/transaccionesExitosas';
import useStore from '@/stores/base';
import { useState, useMemo } from 'react';

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

  // Transformar datos una sola vez
  const productosFixed = useMemo(
    () =>
      productos.map((producto) => ({
        id: String(producto.id),
        producto: producto.cliente,
        SKU: `SKU-${producto.id}`,
        categoria: `Categoría ${Math.ceil(Math.random() * 10)}`,
        proveedor: `Proveedor ${Math.ceil(Math.random() * 5)}`,
        precio_unitario: producto.monto,
        stock: Math.floor(Math.random() * 1000),
      })),
    [productos]
  );

  // Hook para manejar filtros
  const {
    filters,
    filteredAndSortedData,
    updateCategoryFilter,
    updateSortOptions,
    updateSearchTerm,
    // clearFilters,
  } = useFilters({
    data: productosFixed,
    searchKeys: ['producto', 'SKU', 'categoria', 'proveedor'],
  });

  // Hook para paginación
  const { paginatedItems, paginationMeta, changePage } = usePagination(
    filteredAndSortedData
  );

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

  const handleProviderFilter = () => {
    console.log('Provider filter clicked');
    // Implementar lógica de filtrado por proveedores
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // Implementar lógica general de filtro
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={paginatedItems}
      tableColumns={productosColumns}
      paginationMeta={paginationMeta}
      onPageChange={changePage}
      onFilter={handleFilter}
      onCategoryFilter={updateCategoryFilter}
      onProviderFilter={handleProviderFilter}
      onSortBy={updateSortOptions}
      categories={categories}
      selectedCategories={filters.selectedCategories}
      selectedSortOptions={filters.sortOptions}
      onSearch={updateSearchTerm}
      onClearSearch={() => updateSearchTerm('')}
    />
  );
}
