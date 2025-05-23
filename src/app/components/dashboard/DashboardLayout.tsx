import React from 'react';
import dynamic from 'next/dynamic';
import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import TransaccionesTable from '@/app/components/admin/TransaccionesTable';
import MetricsCard from './MetricsCard';
import FilterBar from './FilterBar';
import { TransaccionExitosa } from '@/mock/transaccionesExitosas';
import { PaginationMeta } from '@/stores/base/types';
import { DashboardConfig } from '@/interfaces/dashboard.interface';

const DynamicLineChart = dynamic(() => Promise.resolve(LineChartContent), {
  ssr: false,
  loading: () => <div>Cargando gráfico...</div>,
});

interface DashboardLayoutProps {
  config: DashboardConfig;
  transacciones?: TransaccionExitosa[];
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onAmountFilter?: () => void;
  onClientFilter?: () => void;
  onFilter?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  config,
  transacciones = [],
  paginationMeta,
  onPageChange,
  onDownload,
  onAmountFilter,
  onClientFilter,
  onFilter,
}) => {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row py-7 px-4 md:px-12 items-center gap-7">
        <div className="flex flex-col justify-between items-center h-full">
          <div className="flex h-full items-center">
            <DayPickerComponent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-start gap-4 flex-1-0-0  w-full">
          <FilterBar
            onDownload={onDownload}
            onAmountFilter={onAmountFilter}
            onClientFilter={onClientFilter}
            onFilter={onFilter}
          />

          <MetricsCard metrics={config.metrics}>
            <DynamicLineChart />
          </MetricsCard>
        </div>
      </div>

      {/* Bottom Chart Section */}
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

      {/* Table Section */}
      {config.showTable &&
        transacciones.length > 0 &&
        paginationMeta &&
        onPageChange && (
          <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
            <TransaccionesTable
              title={config.tableTitle}
              transacciones={transacciones}
              paginationMeta={paginationMeta}
              onPageChange={onPageChange}
            />
          </div>
        )}
    </div>
  );
};

export default DashboardLayout;
