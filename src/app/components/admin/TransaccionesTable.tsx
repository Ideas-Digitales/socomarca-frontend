// TransaccionesTable.tsx actualizado para recibir columnas como props
import React from 'react';
import { PaginationMeta } from '@/stores/base/types';
import Pagination from '../global/Pagination';

// Tipo genérico para las columnas
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TransaccionesTableProps<T = any> {
  title?: string;
  transacciones: T[];
  columns?: TableColumn<T>[];
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const TransaccionesTable = <T extends Record<string, any> = any>({
  title,
  transacciones,
  columns = [],
  paginationMeta,
  onPageChange,
}: TransaccionesTableProps<T>) => {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4">{title}</h3>}

      {/* Mantener exactamente la estructura original de la tabla */}
      <div className="overflow-x-auto border-[1px] border-gray-200 border-solid">
        <table className="min-w-full">
          <thead className="h-full">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="bg-slate-500 text-white text-sm font-semibold py-3 px-6"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transacciones.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const value = row[column.key as keyof T];
                  return (
                    <td key={colIndex} className="text-sm py-3 px-6">
                      {column.render
                        ? column.render(value, row)
                        : String(value || '')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={paginationMeta} onPageChange={onPageChange} />
    </div>
  );
};

export default TransaccionesTable;
