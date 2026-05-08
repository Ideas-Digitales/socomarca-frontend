'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getUserOrders } from '@/services/actions/order.actions';
import {
  getUserCreditLine,
  type CreditLineRaw,
} from '@/services/actions/user.actions';
import useAuthStore from '@/stores/useAuthStore';

const formatCLP = (value: number) =>
  Math.abs(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

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

interface CompraCredito {
  id: number;
  monto: number;
  fecha: string;
}

interface CreditoView {
  limite: number;
  utilizado: number;
  disponible: number;
  vencido: number;
  estado: 'activa' | 'bloqueada' | 'suspendida';
}

const buildCreditoView = (raw: CreditLineRaw): CreditoView => {
  const limite = raw.CRSD;
  const utilizado = raw.CRSDVU;
  const vencido = raw.CRSDVV;
  const disponible = Math.max(limite - utilizado, 0);
  const estado: CreditoView['estado'] = raw.status === 'blocked' ? 'bloqueada' : 'activa';

  return { limite, utilizado, disponible, vencido, estado };
};

export default function LineaCreditoSection() {
  const { user } = useAuthStore();
  const [credito, setCredito] = useState<CreditoView | null>(null);
  const [creditoError, setCreditoError] = useState<string | null>(null);
  const [loadingCredito, setLoadingCredito] = useState(true);
  const [compras, setCompras] = useState<CompraCredito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoadingCredito(false);
      return;
    }

    setLoadingCredito(true);
    getUserCreditLine(user.id).then((res) => {
      if (res.success && res.data) {
        logCreditoRaw(res.data as unknown as Record<string, unknown>);
        setCredito(buildCreditoView(res.data));
        setCreditoError(null);
      } else {
        setCreditoError(res.error ?? 'No se pudo obtener la línea de crédito');
      }
      setLoadingCredito(false);
    });
  }, [user?.id]);

  useEffect(() => {
    getUserOrders(1, 20, 'created_at', 'desc', 'random_credit').then((res) => {
      if (res?.data) {
        setCompras(
          res.data.map((order: any) => ({
            id: order.id,
            monto: order.amount,
            fecha: order.created_at,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const estado = credito?.estado;
  const isBloqueada = estado === 'bloqueada';

  const estadoLabel =
    estado === 'activa' ? 'Activa'
    : estado === 'bloqueada' ? 'En facturación'
    : estado === 'suspendida' ? 'Suspendida'
    : '';

  const estadoBadgeClass =
    estado === 'activa'
      ? 'text-lime-700 bg-lime-50 border-lime-200'
      : estado === 'bloqueada'
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-yellow-700 bg-yellow-50 border-yellow-200';

  const EstadoIcon =
    estado === 'activa' ? CheckCircleIcon
    : estado === 'bloqueada' ? ClockIcon
    : ExclamationTriangleIcon;

  const accentColor = isBloqueada ? '#D97706' : '#6CB409';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Línea de Crédito</h2>
        {credito && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${estadoBadgeClass}`}
          >
            <EstadoIcon className="w-3.5 h-3.5" />
            {estadoLabel}
          </span>
        )}
      </div>

      {/* Resumen principal */}
      {loadingCredito ? (
        <div className="rounded-xl bg-white shadow-sm mb-6 px-6 py-8 text-sm text-gray-500">
          Cargando línea de crédito...
        </div>
      ) : creditoError || !credito ? (
        <div className="rounded-xl bg-white shadow-sm mb-6 px-6 py-8 text-sm text-red-600">
          {creditoError ?? 'No se pudo cargar la línea de crédito.'}
        </div>
      ) : (
        <div
          className={`rounded-xl bg-white shadow-sm mb-6 overflow-hidden ${
            isBloqueada ? 'ring-1 ring-amber-200' : ''
          }`}
        >
          {isBloqueada && (
            <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
              <ClockIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Tu pago anterior aún se está facturando. Intenta más tarde.
              </p>
            </div>
          )}

          <div className={`px-6 py-5 ${isBloqueada ? 'bg-amber-50/60' : 'bg-[#edf2f7]'}`}>
            <p className="text-xs font-medium text-[#64748B] mb-1 uppercase tracking-wide">Saldo disponible</p>
            <p
              className="text-4xl font-extrabold"
              style={{ color: isBloqueada ? '#D97706' : '#1E1E2F' }}
            >
              {formatCLP(credito.disponible)}
            </p>
            {isBloqueada && (
              <p className="text-xs text-amber-700 mt-1">
                No disponible temporalmente para nuevas compras
              </p>
            )}
          </div>

          <div className="px-6 py-4">
            <div className="flex justify-between text-xs text-[#64748B] mb-2">
              <span>Utilizado: <strong className="text-[#1E1E2F]">{formatCLP(credito.utilizado)}</strong></span>
              <span className="font-semibold" style={{ color: accentColor }}>
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
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>

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
              <p className="text-sm font-bold" style={{ color: accentColor }}>{formatCLP(credito.disponible)}</p>
            </div>
          </div>
        </div>
      )}

      <h3 className="font-bold text-gray-800 mb-3">Compras registradas en el sitio</h3>
      <div className="space-y-2">
        {loading ? (
          <div className="rounded bg-[#edf2f7] px-4 py-3 text-sm text-gray-500">Cargando...</div>
        ) : compras.length === 0 ? (
          <div className="rounded bg-[#edf2f7] px-4 py-3 text-sm text-gray-500">
            Aún no hay compras registradas en el sitio para esta línea de crédito.
          </div>
        ) : (
          compras.map((compra) => (
            <div key={compra.id} className="flex items-center justify-between bg-[#edf2f7] px-4 py-3 rounded">
              <div>
                <p className="font-medium text-gray-700 text-sm">Compra #{compra.id}</p>
                <p className="text-xs text-gray-500">{formatFecha(compra.fecha)}</p>
              </div>
              <span className="font-semibold text-sm text-lime-600">
                − {formatCLP(compra.monto)}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 italic">
        Esta sección solo muestra compras realizadas en el sitio y el saldo disponible informado. No incluye otros cargos, abonos ni datos administrativos de la línea de crédito.
      </p>
    </div>
  );
}
