'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import { useFilters } from '@/hooks/useFilters';
import {
  DashboardTableConfig,
  TableColumn,
} from '@/interfaces/dashboard.interface';
import { comunasRegiones } from '@/mock/comunasVentas';
import { ClientDetail } from '@/interfaces/client.interface';
import useStore from '@/stores/base';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

interface ClientRow {
  id: string;
  cliente: string;
  monto: string;
  fecha: string;
  estado: string;
}

export default function ClientesAdmin() {
  const { 
    clientsList,
    fetchClients,
  } = useStore();


  const comunas = comunasRegiones;

  // Estado para las comunas seleccionadas
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([]);

  // Definir las columnas de la tabla
  const clientesColumns: TableColumn<ClientRow>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'monto', label: 'Monto' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ];

  // Transformar datos una sola vez
  const clientsData = useMemo(
    () => {
      if (!clientsList || !Array.isArray(clientsList)) {
        return [];
      }
      
      return clientsList.map((client: ClientDetail) => ({
        id: String(client.id),
        cliente: client.cliente || client.customer || 'Sin nombre',
        monto: formatCurrency(client.monto || client.amount || 0),
        fecha: new Date(client.fecha || client.date || '').toLocaleDateString('es-CL'),
        estado: client.estado || client.status || 'Sin estado',
      }));
    },
    [clientsList]
  );

  // Hook para manejar filtros y ordenamiento
  const {
    filters,
    filteredAndSortedData,
    updateSortOption,
    updateSearchTerm,
  } = useFilters({
    data: clientsData,
    searchKeys: ['cliente', 'estado'],
    sortableColumns: clientesColumns,
  });

  const config: DashboardTableConfig = {
    title: 'Clientes',
    showTable: true,
    tableTitle: 'Clientes',
  };

  // Cargar datos iniciales
  useEffect(() => {

    
    fetchClients('', '', 15, 1);
  }, [fetchClients]);

  // Manejar el cambio de comunas seleccionadas
  const handleComuneFilter = (selectedIds: (string | number)[]) => {
    console.log('Comunas seleccionadas:', selectedIds);
    setSelectedCommunes(selectedIds.map(id => String(id)));
    // Aquí puedes agregar lógica adicional para filtrar los datos según las comunas
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <DashboardTableLayout
      config={config}
      tableData={filteredAndSortedData}
      tableColumns={clientesColumns}
      onFilter={handleFilter}
      onCommuneFilter={handleComuneFilter}
      communes={comunas}
      selectedCommunes={selectedCommunes}
      onSortBy={updateSortOption}
      categories={[]}
      selectedCategories={filters.selectedCategories}
      selectedSortOption={filters.sortOption}
      onSearch={updateSearchTerm}
      onClearSearch={() => updateSearchTerm('')}
    />
  );
}
