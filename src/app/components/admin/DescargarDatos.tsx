'use client';

import {
  fetchExportTotalDeVentas,
  fetchExportTransacciones,
  fetchExportClientesMasCompra,
  fetchExportProductosMasVentas,
  fetchExportMunicipalidadesMasVentas,
} from '@/services/actions/exports.actions';
import { useState } from 'react';
import useStore from '@/stores/base';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

interface DescargarDatosProps {
  type?: string;
}

export default function DescargarDatos({
  type = 'sales',
}: DescargarDatosProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal, reportsFilters, failedReportsFilters } =
    useStore();
  const pathname = usePathname();

  // Detectar automáticamente el tipo basado en la ruta
  const getCurrentType = () => {
    if (pathname.includes('transacciones-fallidas')) {
      return 'failed';
    }
    if (pathname.includes('total-de-ventas')) {
      return 'total-ventas';
    }
    if (pathname.includes('clientes-mas-compra')) {
      return 'clients';
    }
    if (pathname.includes('productos-mas-ventas')) {
      return 'products';
    }
    if (pathname.includes('comunas-mas-ventas')) {
      return 'municipalities';
    }
    return type; // fallback al prop
  };

  const currentType = getCurrentType();

  // Componentes de modal
  const SuccessModal = ({ message }: { message: string }) => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircleIcon className="w-16 h-16 text-lime-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          ¡Descarga exitosa!
        </h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md transition-colors cursor-pointer"
      >
        Aceptar
      </button>
    </div>
  );

  const ErrorModal = ({ message }: { message: string }) => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <XCircleIcon className="w-16 h-16 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Error al descargar
        </h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors cursor-pointer"
      >
        Aceptar
      </button>
    </div>
  );

  const downloadFile = (data: ArrayBuffer | Blob, filename: string, mimeType: string) => {
    const blob = data instanceof ArrayBuffer ? new Blob([data], { type: mimeType }) : data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownload = async () => {
    // Seleccionar los filtros correctos según el tipo detectado
    const currentFilters =
      currentType === 'failed' ? failedReportsFilters : reportsFilters;

    if (!currentFilters) return;

    setIsLoading(true);

    try {
      // Seleccionar la función correcta según el tipo
      let exportFunction;
      let exportParams;

      if (currentType === 'failed' || currentType === 'sales') {
        exportFunction = fetchExportTransacciones;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
          type: currentType,
          client: currentFilters.selectedClient,
          total_min: currentFilters.total_min,
          total_max: currentFilters.total_max,
        };
      } else if (currentType === 'total-ventas') {
        exportFunction = fetchExportTotalDeVentas;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
          type: 'sales',
          client: currentFilters.selectedClient,
          total_min: currentFilters.total_min,
          total_max: currentFilters.total_max,
        };
      } else if (currentType === 'clients') {
        exportFunction = fetchExportClientesMasCompra;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
          total_min: currentFilters.total_min,
          total_max: currentFilters.total_max,
        };
      } else if (currentType === 'products') {
        exportFunction = fetchExportProductosMasVentas;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
        };
      } else if (currentType === 'municipalities') {
        exportFunction = fetchExportMunicipalidadesMasVentas;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
        };
      } else {
        exportFunction = fetchExportTotalDeVentas;
        exportParams = {
          start: currentFilters.start,
          end: currentFilters.end,
          type: currentType,
          client: currentFilters.selectedClient,
          total_min: currentFilters.total_min,
          total_max: currentFilters.total_max,
        };
      }

      const result = await exportFunction(exportParams as any);

      if (result.success && result.data) {
        // Generar nombre de archivo con fecha
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `reporte-${currentType}-${dateStr}.xlsx`;

        // Si la respuesta es un ArrayBuffer (archivo Excel binario)
        if (result.data instanceof ArrayBuffer) {
          downloadFile(
            result.data,
            filename,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        } else {
          // Si por alguna razón no es ArrayBuffer, intentar crear un blob
          const blob = new Blob([result.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          downloadFile(blob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }

        // Mostrar modal de éxito
        openModal('', {
          title: 'Descarga exitosa',
          size: 'sm',
          content: (
            <SuccessModal message="El archivo Excel se ha descargado correctamente." />
          ),
        });
      } else {
        console.error('Error al exportar:', result.message);
        openModal('', {
          title: 'Error al exportar',
          size: 'sm',
          content: (
            <ErrorModal
              message={result.message || 'Error al exportar los datos'}
            />
          ),
        });
      }
    } catch (error) {
      console.error('Error al descargar:', error);
      openModal('', {
        title: 'Error al descargar',
        size: 'sm',
        content: (
          <ErrorModal message="Error al descargar los datos. Inténtalo de nuevo." />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      data-cy="download-btn"
      className="py-2 px-4 text-xs bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out duration-300 rounded-[6px] cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? 'Descargando...' : 'Descargar datos'}
    </button>
  );
}