import { DashboardTableLayoutProps } from '@/interfaces/dashboard.interface';
import dynamic from 'next/dynamic';
import CustomTable from '../admin/CustomTable';
import Search from '../global/Search';
import FilterOptions from './FilterOptions';
import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import MetricsCard from './MetricsCard';
import { useRef } from 'react';

const DynamicLineChart = dynamic(() => Promise.resolve(LineChartContent), {
  ssr: false,
  loading: () => <div>Cargando gráfico...</div>,
});

interface DashboardTableLayoutExtraProps {
  chartData?: { month: string; value: number }[];
  isLoadingChart?: boolean;
}

const DashboardTableLayout = <T extends Record<string, any> = any>({
  config,
  tableData = [],
  tableColumns,
  productPaginationMeta,
  onPageChange,
  onFilter,
  onCategoryFilter,
  onProviderFilter,
  onSortBy,
  categories,
  selectedCategories = [],
  selectedSortOption = null,
  selectedCommunes = [],
  onSearch,
  onClearSearch,
  onCommuneFilter,
  communes,
  chartConfig,
  showDatePicker = false,
  onAmountFilter,
  onClientFilter,
  clients = [],
  customers = [],
  selectedClients = [],
  amountValue = { min: '', max: '' },
  searchableDropdown,
  onDateRangeChange,
  initialDateRange,
  isLoadingChart,
}: DashboardTableLayoutProps<T> & DashboardTableLayoutExtraProps) => {
  const mainChartRef = useRef<{ updateChartWithFilters: () => void }>(null);
  const bottomChartRef = useRef<{ updateChartWithFilters: () => void }>(null);

  const handleSearch = (searchTermValue: string) => {
    onSearch?.(searchTermValue);
  };

  const handleClearSearch = () => {
    onClearSearch?.();
  };

  const handleFilter = () => {
    // Actualizar ambos gráficos cuando se presiona filtrar
    if (mainChartRef.current) {
      mainChartRef.current.updateChartWithFilters();
    }
    if (bottomChartRef.current) {
      bottomChartRef.current.updateChartWithFilters();
    }
    // Llamar al onFilter original
    onFilter?.();
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* FILTROS SIEMPRE ARRIBA - Primera sección */}
      <div className="flex flex-col justify-between items-center h-full w-full max-w-7xl px-4 md:px-8 py-4">
        {onSearch && (
          <Search
            showLabel={false}
            className="w-full"
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Buscar..."
          />
        )}

        <FilterOptions
          onCommuneFilter={onCommuneFilter}
          selectedCommunes={selectedCommunes}
          onFilter={handleFilter}
          onCategoryFilter={onCategoryFilter}
          onProviderFilter={onProviderFilter}
          onSortBy={onSortBy}
          categories={categories}
          selectedCategories={selectedCategories}
          tableColumns={tableColumns}
          selectedSortOption={selectedSortOption}
          communes={communes || []} // Aseguramos que siempre pasemos un array
          onAmountFilter={onAmountFilter}
          amountValue={amountValue}
          onClientFilter={onClientFilter}
          clients={clients}
          customers={customers}
          selectedClients={selectedClients}
          searchableDropdown={searchableDropdown}
        />
      </div>

      {/* Header Section con DatePicker y Gráficos (si se especifica) */}
      {(showDatePicker || chartConfig?.showMetricsChart) && (
        <div className="flex flex-col md:flex-row py-7 px-4 md:px-12 items-center gap-7">
          {showDatePicker && (
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex h-full items-center">
                <DayPickerComponent 
                  onDateRangeChange={onDateRangeChange}
                  initialDateRange={initialDateRange}
                />
              </div>
            </div>
          )}

          {/* Gráfico principal con métricas */}
          {chartConfig?.showMetricsChart && (
            <div className="flex flex-col items-start gap-4 flex-1-0-0 w-full">
              <MetricsCard metrics={chartConfig.metrics || []} isLoading={isLoadingChart}>
                <DynamicLineChart ref={mainChartRef} loading={isLoadingChart} />
              </MetricsCard>
            </div>
          )}
        </div>
      )}

      {/* Gráfico inferior (si se especifica) */}
      {chartConfig?.showBottomChart && (
        <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
          <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
            <div className="text-lime-500">
              <p className="text-sm font-medium">
                {chartConfig.bottomChartTitle || 'Total de ingresos'}
              </p>
              <h4 className="text-lg font-bold text-[20px]">
                {chartConfig.bottomChartValue || '20.000.000'}
              </h4>
            </div>
            <DynamicLineChart ref={bottomChartRef} loading={isLoadingChart} />
          </div>
        </div>
      )}

      {/* Sección de tabla */}
      {config.showTable && tableData.length > 0 && (
        <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
          <CustomTable
            title={config.tableTitle}
            data={tableData}
            columns={tableColumns}
            productPaginationMeta={productPaginationMeta}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardTableLayout;
