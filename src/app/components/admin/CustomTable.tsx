import React from 'react';
import { PaginationMeta } from '@/stores/base/types';
import Pagination from '../global/Pagination';

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface CustomTableProps<T = any> {
  title?: string;
  data: T[];
  columns?: TableColumn<T>[];
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const CustomTable = <T extends Record<string, any> = any>({
  title,
  data,
  columns = [],
  paginationMeta,
  onPageChange,
}: CustomTableProps<T>) => {
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
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-100'}
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key as keyof T];
                  return (
                    <td
                      key={colIndex}
                      className="text-sm py-3 px-6 text-center"
                    >
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

export default CustomTable;
