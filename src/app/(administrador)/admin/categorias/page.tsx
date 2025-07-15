'use client'

import CustomTable from "@/app/components/admin/CustomTable";
import { fetchGetCategories } from "@/services/actions/categories.actions";
import { useEffect, useState } from "react";
import { CategoryComponent } from "@/interfaces/category.interface";
import { PaginationMeta } from "@/stores/base/types";
import Search from "@/app/components/global/Search";
import TableSkeleton from "@/app/components/admin/TableSkeleton";
import SortDropdown from "@/app/components/filters/SortDropdown";
import { SortOption } from "@/interfaces/dashboard.interface";
import { formatDate } from "@/utils/formatCurrency";

const PAGE_SIZE = 20;

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "code", label: "Código" },
  { key: "products_count", label: "Productos", render: (_: any, row: CategoryComponent) => row.products_count || 0 },
  { key: "created_at", label: "Fecha Creación", render: (_: any, row: CategoryComponent) => row.created_at ? formatDate(row.created_at) : '-' },
];

export default function CategoriesAdmin() {
  const [data, setData] = useState<CategoryComponent[]>([]);
  const [originalData, setOriginalData] = useState<CategoryComponent[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado para el ordenamiento
  const [sortOption, setSortOption] = useState<SortOption | null>({ key: "id", label: "ID", direction: "asc" });

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    setInitialLoading(true);
    fetchGetCategories().then((res) => {
      if (res.ok && res.data) {
        console.log('Categories response:', res.data);
        // Asegurar que sea un array
        const categoriesData = Array.isArray(res.data) ? res.data : res.data.data || [];
        setData(categoriesData as CategoryComponent[]);
        setOriginalData(categoriesData as CategoryComponent[]);
        
        // Crear meta de paginación simulada para los datos mock
        const totalItems = categoriesData.length;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        setMeta({
          current_page: 1,
          last_page: totalPages,
          per_page: PAGE_SIZE,
          total: totalItems,
          from: 1,
          to: Math.min(PAGE_SIZE, totalItems),
          links: [],
          path: '/admin/categorias'
        });
      }
      setInitialLoading(false);
    });
  }, []);

  // Opciones de columnas para ordenar
  const sortColumns = [
    { key: "id", label: "ID" },
    { key: "created_at", label: "Fecha Creación" },
  ];

  // Función para filtrar y ordenar datos localmente
  const filterAndSortData = (categories: CategoryComponent[], search: string, sort: SortOption | null) => {
    let filteredData = [...categories];

    // Aplicar filtro de búsqueda
    if (search) {
      filteredData = filteredData.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.code?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    if (sort) {
      filteredData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.key) {
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          case 'created_at':
            aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
            bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
            break;
          default:
            aValue = a.id;
            bValue = b.id;
        }

        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filteredData;
  };

  // Manejar cambio de orden
  const handleSortChange = (option: SortOption | null) => {
    setSortOption(option);
    setLoading(true);
    
    // Simular delay para mostrar loading
    setTimeout(() => {
      const filteredData = filterAndSortData(originalData, searchTerm, option);
      
      // Actualizar meta de paginación
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / PAGE_SIZE);
      setMeta({
        current_page: 1,
        last_page: totalPages,
        per_page: PAGE_SIZE,
        total: totalItems,
        from: 1,
        to: Math.min(PAGE_SIZE, totalItems),
        links: [],
        path: '/admin/categorias'
      });
      
      setData(filteredData);
      setLoading(false);
    }, 300);
  };

  // Manejar búsqueda por nombre
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setLoading(true);
    
    // Simular delay para mostrar loading
    setTimeout(() => {
      const filteredData = filterAndSortData(originalData, term, sortOption);
      
      // Actualizar meta de paginación
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / PAGE_SIZE);
      setMeta({
        current_page: 1,
        last_page: totalPages,
        per_page: PAGE_SIZE,
        total: totalItems,
        from: 1,
        to: Math.min(PAGE_SIZE, totalItems),
        links: [],
        path: '/admin/categorias'
      });
      
      setData(filteredData);
      setLoading(false);
    }, 300);
  };

  // Limpiar búsqueda
  const handleClearSearch = async () => {
    setSearchTerm("");
    const defaultSort = { key: "id", label: "ID", direction: "asc" as const };
    setSortOption(defaultSort);
    setLoading(true);
    
    // Simular delay para mostrar loading
    setTimeout(() => {
      const filteredData = filterAndSortData(originalData, "", defaultSort);
      
      // Actualizar meta de paginación
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / PAGE_SIZE);
      setMeta({
        current_page: 1,
        last_page: totalPages,
        per_page: PAGE_SIZE,
        total: totalItems,
        from: 1,
        to: Math.min(PAGE_SIZE, totalItems),
        links: [],
        path: '/admin/categorias'
      });
      
      setData(filteredData);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex justify-center flex-row w-full">
      <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full max-w-7xl">
        {/* BUSCADOR Y FILTROS */}
        <div className="w-full mb-6">
          {/* BUSCADOR */}
          <div className="w-full mb-4">
            <Search
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Buscar categoría por nombre o código"
              showLabel={false}
              initialValue={searchTerm}
            />
          </div>
          {/* FILTROS EN LÍNEA */}
          <div className="flex justify-start gap-4 w-full">
            <div className="w-[300px]">
              <SortDropdown
                tableColumns={sortColumns}
                selectedOption={sortOption}
                onSelectionChange={handleSortChange}
              />
            </div>
          </div>
        </div>
        
        {initialLoading ? (
          <TableSkeleton columns={columns.length} rows={10} title="Categorías" />
        ) : loading ? (
          <TableSkeleton columns={columns.length} rows={10} title="Categorías" />
        ) : (
          <div className="relative w-full">
            <CustomTable
              title="Categorías"
              data={data}
              columns={columns}
              productPaginationMeta={meta}
              onPageChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
