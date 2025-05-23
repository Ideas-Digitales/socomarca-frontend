import { TransaccionExitosa } from '@/mock/transaccionesExitosas';
import Pagination from '@/app/components/global/Pagination';
import { PaginationMeta } from '@/stores/base/types';

interface TransaccionesTableProps {
  transacciones: TransaccionExitosa[];
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  title?: string;
  className?: string;
}

export default function TransaccionesTable({
  transacciones,
  paginationMeta,
  onPageChange,
  title = 'Transacciones exitosas',
  className = '',
}: TransaccionesTableProps) {
  // Formatear monto
  const formatearMonto = (monto: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  };

  return (
    <div
      className={`flex flex-col gap-3 py-[14px] px-5 rounded-[6px] border-gray-100 border-[1px] border-solid w-full ${className}`}
    >
      <h4 className="text-lg font-bold text-[20px]">{title}</h4>

      {/* Tabla con scroll horizontal para mobile y desktop */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                # de la orden/venta
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Cliente
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Monto
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Monto
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Monto
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Fecha
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion, index) => (
              <tr
                key={transaccion.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="py-3 px-4 text-sm text-blue-600 font-medium whitespace-nowrap">
                  #{transaccion.id}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                  {transaccion.cliente}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                  {formatearMonto(transaccion.monto)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                  {formatearMonto(transaccion.monto)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                  {formatearMonto(transaccion.monto)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                  {transaccion.fecha}
                </td>
                <td className="py-3 px-4 text-sm whitespace-nowrap">
                  <button className="text-lime-500 hover:text-lime-600 font-medium transition-colors">
                    {transaccion.acciones}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination meta={paginationMeta} onPageChange={onPageChange} />
    </div>
  );
}
