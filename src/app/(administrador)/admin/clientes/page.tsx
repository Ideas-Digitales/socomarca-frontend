'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { searchUsersAction } from '@/services/actions/user.actions';
import {
  SearchUsersRequest,
  SearchFilter,
  ApiUser,
} from '@/interfaces/user.interface';
import CustomTable from '@/app/components/admin/CustomTable';
import SearchableDropdown from '@/app/components/filters/SearchableDropdown';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ClientTableData {
  id: number;
  name: string;
  email: string;
  phone: string;
  rut: string;
  business_name: string;
  is_active: string;
  last_login: string;
  created_at: string;
}

const ClientsPage = () => {
  const [clients, setClients] = useState<ClientTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Campos disponibles para ordenamiento
  const sortOptions = [
    { id: 'name', name: 'Nombre' },
    { id: 'email', name: 'Email' },
    { id: 'phone', name: 'Teléfono' },
    { id: 'rut', name: 'RUT' },
    { id: 'business_name', name: 'Razón Social' },
    { id: 'is_active', name: 'Estado' },
    { id: 'last_login', name: 'Último Login' },
    { id: 'created_at', name: 'Fecha Creación' },
  ];

  // Opciones de filtro
  const filterOptions = [
    { id: 'all', name: 'Todos los clientes' },
    { id: 'active', name: 'Clientes activos' },
    { id: 'inactive', name: 'Clientes inactivos' },
    { id: 'recent', name: 'Clientes recientes (últimos 30 días)' },
  ];

  // Transformar datos de la API a formato de tabla
  const transformApiUserToTableData = (apiUser: ApiUser): ClientTableData => {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      phone: apiUser.phone,
      rut: apiUser.rut,
      business_name: apiUser.business_name,
      is_active: apiUser.is_active ? 'Activo' : 'Inactivo',
      last_login: apiUser.last_login
        ? new Date(apiUser.last_login).toLocaleDateString('es-CL')
        : 'Nunca',
      created_at: new Date(apiUser.created_at).toLocaleDateString('es-CL'),
    };
  };

  // Cargar clientes
  const loadClients = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        // Construir filtros para la búsqueda
        const buildSearchFilters = (): SearchFilter[] => {
          const filters: SearchFilter[] = [];

          // Filtro por término de búsqueda
          if (debouncedSearchTerm.trim()) {
            filters.push({
              field: 'name',
              operator: 'ILIKE',
              value: `%${debouncedSearchTerm.trim()}%`,
            });
          }

          // Filtros adicionales
          switch (activeFilter) {
            case 'active':
              filters.push({
                field: 'is_active',
                operator: '=',
                value: true,
              });
              break;
            case 'inactive':
              filters.push({
                field: 'is_active',
                operator: '=',
                value: false,
              });
              break;
            case 'recent':
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              filters.push({
                field: 'created_at',
                operator: '>=',
                value: thirtyDaysAgo.toISOString().split('T')[0], // Solo la fecha sin tiempo
              });
              break;
          }

          return filters;
        };

        const searchRequest: SearchUsersRequest = {
          filters: buildSearchFilters(),
          roles: ['cliente'], // Siempre filtrar solo por rol cliente
          per_page: 10,
          sort_by: sortField,
          sort_order: sortOrder,
          page: page,
        };

        console.log('Search request:', JSON.stringify(searchRequest, null, 2));

        const response = await searchUsersAction(searchRequest);

        console.log('Search response:', response);

        if (response.success && response.data) {
          const transformedData = response.data.data.map((apiUser: any) =>
            transformApiUserToTableData(apiUser)
          );

          setClients(transformedData);
          setPaginationMeta(response.data.meta);
          setCurrentPage(page);
        } else {
          setError(response.error || 'Error al cargar los clientes');
        }
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error loading clients:', err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm, activeFilter, sortField, sortOrder]
  );

  // Efecto para debounce de la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando cambia la búsqueda
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efecto para cargar clientes cuando cambian los filtros o la página
  useEffect(() => {
    loadClients(currentPage);
  }, [loadClients, currentPage]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // // Manejar cambio de ordenamiento
  // const handleSortChange = (field: string) => {
  //   if (sortField === field) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortField(field);
  //     setSortOrder('asc');
  //   }
  //   setCurrentPage(1); // Resetear a la primera página cuando cambia el ordenamiento
  // };

  // Columnas de la tabla
  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: ClientTableData) => (
        <div className="text-left">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.business_name}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="text-left">
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (value: string) => (
        <div className="text-center">
          <span className="text-gray-900">{value || 'No especificado'}</span>
        </div>
      ),
    },
    {
      key: 'rut',
      label: 'RUT',
      render: (value: string) => (
        <div className="text-center">
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (value: string) => (
        <div className="text-center">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              value === 'Activo'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'last_login',
      label: 'Último Login',
      render: (value: string) => (
        <div className="text-center">
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha Creación',
      render: (value: string) => (
        <div className="text-center">
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Clientes
        </h1>
        <p className="text-gray-600">
          Administra y visualiza todos los clientes registrados en el sistema
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro de estado */}
          <div>
            <SearchableDropdown
              options={filterOptions}
              selectedOption={
                filterOptions.find((opt) => opt.id === activeFilter) || null
              }
              onSelectionChange={(option) => {
                setActiveFilter(String(option?.id || 'all'));
                setCurrentPage(1); // Resetear a la primera página cuando cambia el filtro
              }}
              placeholder="Filtrar por estado"
              className="w-full"
            />
          </div>

          {/* Ordenamiento */}
          <div>
            <SearchableDropdown
              options={sortOptions}
              selectedOption={
                sortOptions.find((opt) => opt.id === sortField) || null
              }
              onSelectionChange={(option) => {
                if (option) {
                  setSortField(String(option.id));
                  setCurrentPage(1); // Resetear a la primera página cuando cambia el campo de ordenamiento
                }
              }}
              placeholder="Ordenar por"
              className="w-full"
            />
          </div>

          {/* Botón de orden ascendente/descendente */}
          <div>
            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                setCurrentPage(1); // Resetear a la primera página cuando cambia el orden
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>{sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando clientes...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadClients(1)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <CustomTable
            title="Lista de Clientes"
            data={clients}
            columns={columns}
            productPaginationMeta={paginationMeta}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Información</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Se muestran solo usuarios clientes</li>
          <li>• Los clientes inactivos no pueden realizar compras</li>
          <li>• El último login indica la última actividad del cliente</li>
          <li>• Puedes filtrar y ordenar por cualquier campo disponible</li>
        </ul>

        {/* Botón de prueba temporal - Comentado para producción */}
        {/* 
        <div className="mt-4 pt-4 border-t border-blue-200">
          <button
            onClick={() => {
              console.log('Current filters:', buildSearchFilters());
              console.log('Current search request:', {
                filters: buildSearchFilters(),
                roles: ['cliente'],
                per_page: 10,
                sort_by: sortField,
                sort_order: sortOrder,
                page: currentPage
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Ver filtros actuales (consola)
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default ClientsPage;
