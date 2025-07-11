import React from 'react';

interface TableSkeletonProps {
  columns: number;
  rows: number;
  title?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows, title }) => {
  return (
    <div className="w-full">
      {title && <h4 className="mb-4 text-xl font-bold">{title}</h4>}
      
      <div className="overflow-x-auto border-[1px] border-gray-200 border-solid">
        <table className="min-w-full">
          <thead className="h-full">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="bg-slate-500 text-white text-sm font-semibold py-3 px-6"
                >
                  <div className="h-4 bg-slate-400 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-100'}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-sm py-3 px-6 text-center"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Skeleton para paginación */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton; 