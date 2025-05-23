'use client';

import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

export default function AdministradorPage() {
  const DynamicLineChart = dynamic(() => Promise.resolve(LineChartContent), {
    ssr: false,
    loading: () => <div>Cargando gráfico...</div>,
  });

  return (
    <div className="bg-white flex py-7 px-12 items-start gap-7">
      <div className="flex flex-col justify-between items-center h-full">
        <div className="flex h-full items-center">
          <DayPickerComponent />
        </div>
      </div>
      {/* Compradores */}
      <div className="flex flex-col items-start gap-4 flex-1-0-0 max-w-[552px] min-w-[552px]">
        <div className="flex items-center gap-3 w-full">
          <button className="w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-sm">
            Montos
            <ChevronDownIcon width={20} height={20} />
          </button>
          <button className="w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-sm">
            Cliente
            <MagnifyingGlassIcon width={20} height={20} />
          </button>
          <button className="w-1/3 py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium">
            Filtrar
          </button>
        </div>
        <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
          <div className="flex items-start gap-4">
            <div className="text-lime-500 w-1/2">
              <p className="text-sm font-medium">Total de compradores</p>
              <h5 className="text-lg font-bold">850</h5>
            </div>
            <div className="text-gray-500 w-1/2">
              <p className="text-sm font-medium">Total de compradores</p>
              <h5 className="text-lg font-bold">850</h5>
            </div>
          </div>
          <div className="flex w-full items-center">
            <DynamicLineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
