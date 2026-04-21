'use client';

import { mockLineaCredito, type MovimientoCredito } from '@/mock/lineaCredito';

const formatCLP = (value: number) =>
  Math.abs(value).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

const formatFecha = (fecha: string) =>
  new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

function MovimientoRow({ mov }: { mov: MovimientoCredito }) {
  return (
    <div className="flex items-center justify-between bg-[#edf2f7] px-4 py-3 rounded">
      <div>
        <p className="font-medium text-gray-700 text-sm">{mov.descripcion}</p>
        <p className="text-xs text-gray-500">{formatFecha(mov.fecha)}</p>
      </div>
      <span className="font-semibold text-sm text-lime-600">
        − {formatCLP(mov.monto)}
      </span>
    </div>
  );
}

export function logCreditoRaw(raw: Record<string, unknown>) {
  console.log('[Línea de Crédito] Datos crudos del ERP:', {
    'Código de entidad (RUT del cliente)':          raw['KOEN'],
    'Código de sucursal':                           raw['SUEN'],
    'Cupo total de crédito sin documentar (CRSD)':  raw['CRSD'],
    'Crédito utilizado - venta (CRSDVU)':           raw['CRSDVU'],
    'Crédito vencido - venta (CRSDVV)':             raw['CRSDVV'],
    'Crédito utilizado - compra (CRSDCU)':          raw['CRSDCU'],
    'Crédito vencido - compra (CRSDCV)':            raw['CRSDCV'],
    '--- Cálculo ---':                              '---',
    'Saldo disponible (CRSD - CRSDVU)':
      (raw['CRSD'] as number) - (raw['CRSDVU'] as number),
  });
}

export default function LineaCreditoSection() {
  const credito = mockLineaCredito;
  const comprasRegistradas = credito.movimientos.filter((mov) => mov.tipo === 'compra');

  const estadoLabel =
    credito.estado === 'activa' ? 'Activa'
    : credito.estado === 'bloqueada' ? 'Bloqueada'
    : 'Suspendida';

  const estadoColor =
    credito.estado === 'activa' ? 'text-lime-600'
    : credito.estado === 'bloqueada' ? 'text-red-600'
    : 'text-yellow-600';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Línea de Crédito</h2>
        <span className={`text-xs font-semibold ${estadoColor}`}>{estadoLabel}</span>
      </div>

      {/* Resumen principal */}
      <div className="rounded-xl bg-white shadow-sm mb-6 overflow-hidden">
        {/* Header con saldo disponible */}
        <div className="bg-[#edf2f7] px-6 py-5">
          <p className="text-xs font-medium text-[#64748B] mb-1 uppercase tracking-wide">Saldo disponible</p>
          <p className="text-4xl font-extrabold text-[#1E1E2F]">{formatCLP(credito.disponible)}</p>
        </div>

        {/* Barra de progreso */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-xs text-[#64748B] mb-2">
            <span>Utilizado: <strong className="text-[#1E1E2F]">{formatCLP(credito.utilizado)}</strong></span>
            <span className="font-semibold" style={{ color: '#6CB409' }}>
              {credito.limite > 0 ? `${Math.round((credito.disponible / credito.limite) * 100)}% disponible` : ''}
            </span>
          </div>
          <div className="w-full bg-[#edf2f7] rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: credito.limite > 0
                  ? `${Math.min((credito.utilizado / credito.limite) * 100, 100)}%`
                  : '0%',
                backgroundColor: '#6CB409',
              }}
            />
          </div>
        </div>

        {/* 3 columnas */}
        <div className="grid grid-cols-3 px-0">
          <div className="px-5 py-4">
            <p className="text-xs text-[#64748B] mb-1">Cupo autorizado</p>
            <p className="text-sm font-bold text-[#1E1E2F]">{formatCLP(credito.limite)}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-[#64748B] mb-1">Saldo utilizado</p>
            <p className="text-sm font-bold text-[#1E1E2F]">{formatCLP(credito.utilizado)}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-[#64748B] mb-1">Saldo disponible</p>
            <p className="text-sm font-bold" style={{ color: '#6CB409' }}>{formatCLP(credito.disponible)}</p>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-3">Compras registradas en el sitio</h3>
      <div className="space-y-2">
        {comprasRegistradas.map((mov) => (
          <MovimientoRow key={mov.id} mov={mov} />
        ))}
        {comprasRegistradas.length === 0 && (
          <div className="rounded bg-[#edf2f7] px-4 py-3 text-sm text-gray-500">
            Aún no hay compras registradas en el sitio para esta línea de crédito.
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 italic">
        Esta sección solo muestra compras realizadas en el sitio y el saldo disponible informado. No incluye otros cargos, abonos ni datos administrativos de la línea de crédito.
      </p>
    </div>
  );
}
