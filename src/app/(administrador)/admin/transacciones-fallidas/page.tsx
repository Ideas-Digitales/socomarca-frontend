'use client';

import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import DescargarDatos from '@/app/components/admin/DescargarDatos';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

export default function VistaResumenPorFecha() {
  const metricas = [
    { label: 'Total fallidas', value: 30, color: 'text-lime-500' },
    { label: 'Total canceladas', value: 15, color: 'text-slate-400' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 bg-white px-4 md:px-12 py-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="md:w-[300px]">
          <DayPickerComponent />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col md:flex-row py-7 md:px-12 items-center gap-7 justify-end">
            {/* Filtros deshabilitados temporalmente por falta de handlers */}

            <button className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md">
              Categorías
              <ChevronDownIcon width={20} height={20} />
            </button>

            <button className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md">
              Cliente
              <MagnifyingGlassIcon width={20} height={20} />
            </button>

            <button className="w-full md:w-1/3 py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium">
              Filtrar
            </button>

            <DescargarDatos />
          </div>

          <div className="bg-slate-50 rounded-md px-4 py-3 mx-12">
            <div className="flex items-center gap-2 text-sm text-slate-800">
              <ShoppingCartIcon className="w-5 h-5 text-lime-500" />
              <span className="font-medium">Carrito creado</span>
              <strong>#20</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas resumen */}
      <div className="flex gap-6">
        {metricas.map((m) => (
          <div key={m.label} className="flex flex-col items-start">
            <span className={`${m.color} text-sm font-medium`}>{m.label}</span>
            <span className="text-black font-bold text-xl">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Gráfico de líneas */}
      <div className="bg-white w-full rounded-md p-4">
        <LineChartContent />
      </div>
    </div>
  );
}
