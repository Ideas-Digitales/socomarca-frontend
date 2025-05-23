'use client';

import DayPickerComponent from '@/app/components/admin/DayPickerComponent';
import LineChartContent from '@/app/components/admin/LineChartContent';
import TransaccionesTable from '@/app/components/admin/TransaccionesTable';
import {
  generarTransaccionesAleatorias,
  TransaccionExitosa,
} from '@/mock/transaccionesExitosas';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { PaginationMeta } from '@/stores/base/types';
import dynamic from 'next/dynamic';
import { useState } from 'react';

export default function TransaccionesExitosas() {
  const DynamicLineChart = dynamic(() => Promise.resolve(LineChartContent), {
    ssr: false,
    loading: () => <div>Cargando gráfico...</div>,
  });

  const [transacciones] = useState<TransaccionExitosa[]>(
    () => generarTransaccionesAleatorias(100) // Más datos para probar la paginación
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Calcular paginación
  const totalPaginas = Math.ceil(transacciones.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const transaccionesPaginadas = transacciones.slice(indiceInicio, indiceFin);

  // Crear meta object para el componente de paginación
  const paginationMeta: PaginationMeta = {
    current_page: paginaActual,
    from: indiceInicio + 1,
    last_page: totalPaginas,
    links: [], // Array vacío ya que no necesitamos links para datos locales
    path: '', // String vacío ya que no hay path para datos locales
    per_page: itemsPorPagina,
    to: Math.min(indiceFin, transacciones.length),
    total: transacciones.length,
  };

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col md:flex-row py-7 px-4 md:px-12 items-center gap-7">
        <div className="flex flex-col justify-between items-center h-full">
          <div className="flex h-full items-center">
            <DayPickerComponent />
          </div>
        </div>
        {/* Compradores */}
        <div className="flex flex-col items-start gap-4 flex-1-0-0 md:max-w-[552px] w-full">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <button className="block w-full md:hidden bg-lime-500 justify-between items-start py-2 h-10 text-white rounded-[6px] hover:bg-lime-600 duration-300 ease-in-out transition-colors text-md text-[14px]">
              Descargar datos
            </button>

            <button className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md">
              Montos
              <ChevronDownIcon width={20} height={20} />
            </button>
            <button className="w-full md:w-1/3 bg-gray-100 flex justify-between items-start p-[10px] h-10 text-gray-500 text-md">
              Cliente
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
            <button className="w-full md:w-1/3 py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium">
              Filtrar
            </button>
          </div>
          <div className="flex flex-col gap-4 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full">
            <div className="flex items-start gap-4">
              <div className="text-lime-500 w-1/2">
                <p className="text-md font-medium">Transacciones exitosas</p>
                <h5 className="text-lg font-bold">{transacciones.length}</h5>
              </div>
            </div>
            <div className="flex w-full items-center">
              <DynamicLineChart />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
        <TransaccionesTable
          transacciones={transaccionesPaginadas}
          paginationMeta={paginationMeta}
          onPageChange={cambiarPagina}
        />
      </div>
    </div>
  );
}
