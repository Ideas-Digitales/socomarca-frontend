'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardTableConfig,
  TableColumn,
  SortOption,
} from '@/interfaces/dashboard.interface';
import useStore from '@/stores/base';

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
  const {
    categories,
    filteredProducts,
    productPaginationMeta,
    setSearchTerm,
    fetchProducts,
  } = useStore();

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

  // Estado para filtros y búsqueda
  const [searchTerm, setLocalSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Centraliza el envío de todos los filtros actuales
  const applyFilters = (overrides: Partial<{ searchTerm: string; selectedCategory: number | null; sortOption: SortOption | null; page: number; }>) => {
    const merged = {
      searchTerm,
      selectedCategory,
      sortOption,
      page: currentPage,
      ...overrides,
    };
    setSearchTerm({
      field: merged.searchTerm ? 'name' : undefined,
      value: merged.searchTerm || undefined,
      category_id: merged.selectedCategory || undefined,
      sort: merged.sortOption?.direction === 'asc' ? 'asc' : merged.sortOption?.direction === 'desc' ? 'desc' : undefined,
      page: merged.page,
      size: productPaginationMeta?.per_page || 20,
    });
    setCurrentPage(merged.page);
  };

  // Transformar datos para la tabla
  const productosFixed = useMemo(
    () =>
      filteredProducts.map((producto) => {
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
    [filteredProducts]
  );

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts(1, 20); // Puedes ajustar el tamaño de página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers para filtros, búsqueda y ordenamiento
  const handleSearch = (term: string) => {
    setLocalSearchTerm(term);
    applyFilters({ searchTerm: term, page: 1 });
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    applyFilters({ searchTerm: '', page: 1 });
  };

  // Recibe un array de IDs, toma el primero como seleccionado
  const handleCategoryFilter = (selectedIds: number[]) => {
    const categoryId = selectedIds.length > 0 ? selectedIds[0] : null;
    setSelectedCategory(categoryId);
    applyFilters({ selectedCategory: categoryId, page: 1 });
  };

  const handleSortBy = (newSortOption: SortOption | null) => {
    setSortOption(newSortOption);
    applyFilters({ sortOption: newSortOption, page: 1 });
  };

  const handlePageChange = (page: number) => {
    applyFilters({ page });
  };

  const config: DashboardTableConfig = {
    title: 'Productos',
    showTable: true,
    tableTitle: 'Productos',
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={productosFixed}
      tableColumns={productosColumns}
      productPaginationMeta={productPaginationMeta ?? undefined}
      onPageChange={handlePageChange}
      onFilter={() => {}}
      onCategoryFilter={handleCategoryFilter}
      //onProviderFilter={() => {}}
      onSortBy={handleSortBy}
      categories={categories}
      selectedCategories={selectedCategory ? [selectedCategory] : []}
      selectedSortOption={sortOption}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
    />
  );
}
