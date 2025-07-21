'use client';

import { fetchExportTotalDeVentas, fetchExportTransacciones, fetchExportClientesMasCompra, fetchExportProductosMasVentas, fetchExportMunicipalidadesMasVentas } from '@/services/actions/exports.actions';
import { useState } from 'react';
import useStore from '@/stores/base';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

interface DescargarDatosProps {
  type?: string;
}

// Función para convertir XML a CSV
const convertXmlToCsv = (xmlString: string): string => {
  try {
    // Limpiar el XML de caracteres problemáticos
    const cleanXml = xmlString
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remover caracteres de control
      .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;') // Escapar & no escapados
      .trim();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');
    
    // Verificar si hay errores de parsing
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('Error de parsing XML:', parseError.textContent);
      // Intentar extraer datos como texto plano
      return extractDataFromText(xmlString);
    }
    
    // Buscar elementos de datos específicos para reportes
    const dataSelectors = [
      'transaction', 'order', 'sale', 'record', 'item', 'row',
      'venta', 'transaccion', 'pedido', 'registro', 'fila'
    ];
    
    let rows: NodeListOf<Element> | null = null;
    for (const selector of dataSelectors) {
      const foundRows = xmlDoc.querySelectorAll(selector);
      if (foundRows.length > 0) {
        rows = foundRows;
        break;
      }
    }
    
    if (rows && rows.length > 0) {
      // Procesar filas encontradas
      const csvRows: string[] = [];
      let headers: string[] = [];
      
      rows.forEach((row, index) => {
        const rowData: string[] = [];
        const children = Array.from(row.children);
        
        if (index === 0) {
          // Primera fila: extraer headers
          headers = children.map(child => child.tagName);
          csvRows.push(headers.join(','));
        }
        
        // Extraer valores
        children.forEach(child => {
          const value = child.textContent?.replace(/"/g, '""') || '';
          rowData.push(`"${value}"`);
        });
        
        if (rowData.length > 0) {
          csvRows.push(rowData.join(','));
        }
      });
      
      return csvRows.join('\n');
    }
    
    // Si no encuentra elementos específicos, intentar extraer datos estructurados
    const allElements = xmlDoc.querySelectorAll('*');
    const dataElements = Array.from(allElements).filter(el => 
      el.children.length === 0 && el.textContent?.trim() && 
      !['html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style'].includes(el.tagName.toLowerCase())
    );
    
    if (dataElements.length > 0) {
      // Crear CSV con los datos encontrados
      const headers = ['Campo', 'Valor'];
      const csvRows = [headers.join(',')];
      
      dataElements.forEach(el => {
        const field = el.tagName;
        const value = el.textContent?.replace(/"/g, '""') || '';
        csvRows.push(`"${field}","${value}"`);
      });
      
      return csvRows.join('\n');
    }
    
    // Si todo falla, extraer como texto plano
    return extractDataFromText(xmlString);
    
  } catch (error) {
    console.error('Error al convertir XML a CSV:', error);
    return extractDataFromText(xmlString);
  }
};

// Función auxiliar para extraer datos de texto plano
const extractDataFromText = (text: string): string => {
  try {
    // Dividir por líneas y extraer datos útiles
    const lines = text.split('\n').filter(line => line.trim());
    const csvRows = [['Campo', 'Valor'].join(',')];
    
    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine && !cleanLine.startsWith('<?xml') && !cleanLine.startsWith('<!DOCTYPE')) {
        // Intentar extraer pares clave-valor
        const colonIndex = cleanLine.indexOf(':');
        if (colonIndex > 0) {
          const field = cleanLine.substring(0, colonIndex).trim().replace(/"/g, '""');
          const value = cleanLine.substring(colonIndex + 1).trim().replace(/"/g, '""');
          csvRows.push(`"${field}","${value}"`);
        } else {
          // Si no hay dos puntos, usar el índice como campo
          csvRows.push(`"Campo_${index + 1}","${cleanLine.replace(/"/g, '""')}"`);
        }
      }
    });
    
    return csvRows.join('\n');
  } catch (error) {
    console.error('Error al extraer datos de texto:', error);
    return 'Error al procesar los datos';
  }
};

// Función para convertir JSON a CSV
const convertJsonToCsv = (data: any): string => {
  try {
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header]?.toString().replace(/"/g, '""') || '';
          return `"${value}"`;
        });
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    } else {
      // Si es un objeto simple, convertirlo a una fila
      const headers = Object.keys(data);
      const csvRows = [headers.join(',')];
      
      const row = headers.map(header => {
        const value = data[header]?.toString().replace(/"/g, '""') || '';
        return `"${value}"`;
      });
      csvRows.push(row.join(','));
      
      return csvRows.join('\n');
    }
  } catch (error) {
    console.error('Error al convertir JSON a CSV:', error);
    return 'Error al convertir JSON a CSV';
  }
};

export default function DescargarDatos({ type = 'sales' }: DescargarDatosProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal, reportsFilters, failedReportsFilters } = useStore();
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
        <h3 className="text-lg font-medium text-gray-900">¡Descarga exitosa!</h3>
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
        <h3 className="text-lg font-medium text-gray-900">Error al descargar</h3>
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

  const handleDownload = async () => {
    // Seleccionar los filtros correctos según el tipo detectado
    const currentFilters = currentType === 'failed' ? failedReportsFilters : reportsFilters;
    
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
          // region se puede agregar si está disponible en los filtros
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
        // Si la respuesta es un ArrayBuffer (archivo Excel binario)
        if (result.data instanceof ArrayBuffer) {
          const blob = new Blob([result.data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${currentType}-${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Mostrar modal de éxito
          openModal('', {
            title: 'Descarga exitosa',
            size: 'sm',
            content: <SuccessModal message="El archivo Excel se ha descargado correctamente." />
          });
        } else if (typeof result.data === 'string') {
          // Si es string (XML o texto), convertirlo a CSV
          const csvData = convertXmlToCsv(result.data);
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${currentType}-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Mostrar modal de éxito
          openModal('', {
            title: 'Descarga exitosa',
            size: 'sm',
            content: <SuccessModal message="El archivo CSV se ha descargado correctamente." />
          });
        } else {
          // Si es un objeto JSON, convertirlo a CSV
          const csvData = convertJsonToCsv(result.data);
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${currentType}-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Mostrar modal de éxito
          openModal('', {
            title: 'Descarga exitosa',
            size: 'sm',
            content: <SuccessModal message="El archivo CSV se ha descargado correctamente." />
          });
        }
      } else {
          console.error('Error al exportar:', result.message);
          openModal('', {
            title: 'Error al exportar',
            size: 'sm',
            content: <ErrorModal message={result.message || 'Error al exportar los datos'} />
          });
        }
      } catch (error) {
        console.error('Error al descargar:', error);
        openModal('', {
          title: 'Error al descargar',
          size: 'sm',
          content: <ErrorModal message="Error al descargar los datos. Inténtalo de nuevo." />
        });
      } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="py-2 px-4 text-xs bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out duration-300 rounded-[6px] cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? 'Descargando...' : 'Descargar datos'}
    </button>
  );
}
