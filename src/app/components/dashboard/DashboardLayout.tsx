import React from 'react';
import dynamic from 'next/dynamic';
import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import MetricsCard from './MetricsCard';
import FilterBar from './FilterBar';
import {
  DashboardLayoutProps,
} from '@/interfaces/dashboard.interface';
import CustomTable from '../admin/CustomTable';

const DynamicLineChart = dynamic(() => Promise.resolve(LineChartContent), {
  ssr: false,
  loading: () => <div>Cargando gráfico...</div>,
});

const DashboardLayout = <T extends Record<string, any> = any>({
  config,
  tableData = [],
  tableColumns,
  paginationMeta,
  onPageChange,
  onDownload,
  onAmountFilter,
  onClientFilter,
  onCategoryFilter,
  onFilter,
}: DashboardLayoutProps<T>) => {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* Header Section - Exactamente como lo tienes */}
      <div className="flex flex-col md:flex-row py-7 px-4 md:px-12 items-center gap-7">
        <div className="flex flex-col justify-between items-center h-full">
          <div className="flex h-full items-center">
            <DayPickerComponent />
          </div>
        </div>

        {/* Main Content - Exactamente como lo tienes */}
        <div className="flex flex-col items-start gap-4 flex-1-0-0  w-full">
          <FilterBar
            onDownload={onDownload}
            onAmountFilter={onAmountFilter}
            onClientFilter={onClientFilter}
            onCategoryFilter={onCategoryFilter}
            onFilter={onFilter}
          />

          <MetricsCard metrics={config.metrics}>
            <DynamicLineChart />
          </MetricsCard>
        </div>
      </div>

      {/* Bottom Chart Section - Exactamente como lo tienes */}
      {config.showBottomChart && (
        <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
          <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
            <div className="text-lime-500">
              <p className="text-sm font-medium">Total de ingresos</p>
              <h4 className="text-lg font-bold text-[20px]">20.000.000</h4>
            </div>
            <DynamicLineChart />
          </div>
        </div>
      )}

      {/* Table Section - Solo cambiar para pasar las columnas */}
      {config.showTable &&
        tableData.length > 0 &&
        paginationMeta &&
        onPageChange && (
          <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
            <CustomTable
              title={config.tableTitle}
              data={tableData}
              columns={tableColumns}
              paginationMeta={paginationMeta}
              onPageChange={onPageChange}
            />
          </div>
        )}
    </div>
  );
};

export default DashboardLayout;
