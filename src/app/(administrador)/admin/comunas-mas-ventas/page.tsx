'use client';

import DashboardTableLayout from '@/app/components/dashboardTable/DashboardTableLayout';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
  AmountRange,
} from '@/interfaces/dashboard.interface';
import { useState, useEffect } from 'react';
import useStore from '@/stores/base';
import { TopMunicipalitiesResponse } from '@/stores/base/types';

interface MunicipalityFormatted {
  id: string;
  municipality: string;
  month: string;
  total_purchases: number;
  quantity: number;
}

export interface Client {
  id: number;
  name: string;
}

// Mock clients - estos pueden ser removidos cuando haya filtrado real
const clients: Client[] = [
  { id: 1, name: 'Cliente 1' },
  { id: 2, name: 'Cliente 2' },
  { id: 3, name: 'Cliente 3' },
  { id: 4, name: 'Cliente 4' },
];

export default function ComunasMasVentas() {
  // Store hooks
  const {
    chartReportsData,
    isLoadingChartReports,
    fetchChartReports,
    clearChartReports,
    reportsFilters,
    setReportsFilters,
    clearReportsFilters,
    isLoadingChart,
  } = useStore();

  // Estados para manejar filtros
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([]);
  const [amountFilter, setAmountFilter] = useState<AmountRange>({
    min: '',
    max: '',
  });
  
  // Estado para controlar si es la primera carga
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    clearReportsFilters();
    const start = '';
    const end = '';
    
    // Cargar datos de municipalidades
    fetchChartReports(start, end, 'top-municipalities').finally(() => {
      console.log('fetchChartReports');
      setIsInitialLoad(false);
    });

    // Cleanup: limpiar datos cuando el componente se desmonta
    return () => {
      clearChartReports();
    };
  }, [fetchChartReports, clearReportsFilters, clearChartReports]);

  // Transformar datos para la tabla
  const municipalitiesFormatted: MunicipalityFormatted[] = (chartReportsData as TopMunicipalitiesResponse)?.top_municipalities?.map(
    (item: TopMunicipalitiesResponse['top_municipalities'][0], index: number) => ({
      id: String(index + 1),
      municipality: item.municipality,
      month: item.month,
      total_purchases: item.total_purchases,
      quantity: item.quantity,
    })
  ) || [];

  // Definir las métricas basadas en datos del backend
  const metrics: MetricCard[] = [
    {
      label: 'Municipalidades con más ventas',
      value: municipalitiesFormatted.length,
      color: 'lime',
    },
    {
      label: 'Total compras por municipalidad',
      value: `$${municipalitiesFormatted.reduce((sum, m) => sum + m.total_purchases, 0).toLocaleString()}`,
      color: 'gray',
    },
  ];

  // Configuración de gráficos
  const chartConfig: ChartConfig = {
    showMetricsChart: true,
    showBottomChart: false,
    metrics: metrics,
  };

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = {
    title: 'Municipalidades con más ventas',
    showTable: true,
    tableTitle: 'Municipalidades con más ventas',
    showDatePicker: true,
  };

  // Columnas para municipalidades
  const municipalitiesColumns: TableColumn<MunicipalityFormatted>[] = [
    { key: 'municipality', label: 'Municipalidad' },
    { key: 'month', label: 'Mes' },
    {
      key: 'total_purchases',
      label: 'Total Compras',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      render: (value: number) => value.toString(),
    },
  ];

  const handleAmountFilter = (amount: AmountRange) => {
    setAmountFilter(amount);
    const total_min = amount.min ? Number(amount.min) : undefined;
    const total_max = amount.max ? Number(amount.max) : undefined;
    setReportsFilters({ total_min, total_max });
  };


  const handleCommuneFilter = (communeIds: (string | number)[]) => {
    setSelectedCommunes(communeIds.map(id => String(id)));
  };

  const handleFilter = () => {
    // Aplicar filtros
    const { start, end } = reportsFilters;
    fetchChartReports(start, end, 'top-municipalities');
  };

  const handleClearSearch = () => {
    setSelectedClients([]);
    setSelectedCommunes([]);
    setAmountFilter({ min: '', max: '' });
    
    // Limpiar filtros del store
    clearReportsFilters();
    
    // Recargar datos sin filtros
    clearChartReports();
    fetchChartReports('', '', 'top-municipalities');
  };

  // Manejar cambios en el rango de fechas del DatePicker
  const handleDateRangeChange = (start: string, end: string) => {
    setReportsFilters({ start, end });
  };

  // Mostrar loading spinner completo solo en la carga inicial
  if ((isLoadingChartReports || isLoadingChart) && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Cargando datos de municipalidades...</p>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay datos
  if (!isLoadingChartReports && !isLoadingChart && !isInitialLoad && municipalitiesFormatted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No hay datos de municipalidades</h3>
        <p className="text-gray-600 text-sm">No se encontraron datos con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <DashboardTableLayout
        config={config}
        tableData={municipalitiesFormatted}
        tableColumns={municipalitiesColumns}
        productPaginationMeta={undefined} // Sin paginación por ahora
        onPageChange={() => {}} // Sin paginación por ahora
        chartConfig={chartConfig}
        showDatePicker={true}
        onAmountFilter={handleAmountFilter}
        // onClientFilter={handleClientFilter}
        onCommuneFilter={handleCommuneFilter}
        onFilter={handleFilter}
        clients={clients}
        communes={[]} // Sin filtro de comunas por ahora
        selectedClients={selectedClients}
        selectedCommunes={selectedCommunes}
        amountValue={amountFilter}
        onClearSearch={handleClearSearch}
        searchableDropdown={true}
        onDateRangeChange={handleDateRangeChange}
        initialDateRange={{
          start: reportsFilters.start || undefined,
          end: reportsFilters.end || undefined,
        }}
        isLoadingChart={isLoadingChart}
      />

      {/* Loading overlay sutil para cambios de filtros */}
      {(isLoadingChartReports || isLoadingChart) && !isInitialLoad && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700 text-sm">
              {isLoadingChartReports && isLoadingChart ? 'Actualizando datos y gráficos...' :
               isLoadingChartReports ? 'Actualizando datos...' : 'Actualizando gráficos...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
