'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
  SortOption,
} from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';
import { useMemo } from 'react';

interface Producto {
  id: string;
  producto: string;
  SKU: string;
  categoria: string;
  categoryId: number;
  proveedor: string;
  precio_unitario: number;
  stock: number;
}

export default function ProductsAdmin() {
  const { categories, products, productPaginationMeta, setProductPage } =
    useStore();

  // Definir las columnas de la tabla
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

  // Transformar datos - CORREGIDO
  const productosFixed = useMemo(
    () =>
      products.map((producto) => {
        return {
          id: String(producto.id),
          producto: producto.name,
          SKU: producto.sku || `SKU-${producto.id}`,
          categoria: producto.category?.name || 'Sin categoría',
          categoryId: producto.category?.id || 0,
          proveedor: producto.brand?.name || 'Sin marca',
          precio_unitario: producto.price,
          stock: producto.stock,
        };
      }),
    [products]
  );

  // Hook para manejar filtros y búsqueda - CORREGIDO
  const {
    filters,
    filteredAndSortedData,
    updateCategoryFilter,
    updateSortOption,
    updateSearchTerm,
  } = useFilters({
    data: productosFixed,
    categoryKey: 'categoryId', // Usar categoryId para filtrar
    searchKeys: ['producto', 'SKU', 'categoria', 'proveedor'],
    sortableColumns: productosColumns,
  });

  // Manejar cambio de ordenamiento
  const handleSortBy = (newSortOption: SortOption | null) => {
    console.log('handleSortBy', newSortOption);
    updateSortOption(newSortOption);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setProductPage(page);
  };

  const config: DashboardTableConfig = {
    title: 'Productos',
    showTable: true,
    tableTitle: 'Productos',
  };

  const handleProviderFilter = () => {
    console.log('Provider filter clicked');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={filteredAndSortedData}
      tableColumns={productosColumns}
      productPaginationMeta={productPaginationMeta ?? undefined}
      onPageChange={handlePageChange}
      onFilter={handleFilter}
      onCategoryFilter={updateCategoryFilter}
      onProviderFilter={handleProviderFilter}
      onSortBy={handleSortBy}
      categories={categories}
      selectedCategories={filters.selectedCategories}
      selectedSortOption={filters.sortOption}
      onSearch={updateSearchTerm}
      onClearSearch={() => updateSearchTerm('')}
    />
  );
}
