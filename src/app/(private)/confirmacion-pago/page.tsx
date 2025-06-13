'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { getWebpayPaymentDetail } from '@/services/actions/payment.actions';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

type Estado =
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; message: string };

export default function ConfirmacionPagoPage() {
  const [estado, setEstado] = useState<Estado>({ status: 'loading' });
  const router = useRouter();

  useEffect(() => {
    const token_ws = new URLSearchParams(window.location.search).get('token_ws');

    if (!token_ws) {
      setEstado({ status: 'error', message: 'Token no recibido en la URL' });
      return;
    }

    (async () => {
      try {
        const data = await getWebpayPaymentDetail(token_ws);
        setEstado({ status: 'success', data });
      } catch (error: any) {
        setEstado({
          status: 'error',
          message: error?.message || 'No se pudo confirmar el pago.',
        });
      }
    })();
  }, []);

  const formatCLP = (valor: number) =>
    valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  const isPagoExitoso = estado.status === 'success' && estado.data?.payment_status === 'success';

  return (
    <div className="flex flex-col items-center justify-center bg-[#f1f5f9] text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {estado.status === 'loading' && (
          <>
            <LoadingSpinner />
            <h2 className="text-xl font-bold mb-2 mt-5 text-neutral-900">
              Confirmando tu pago...
            </h2>
            <p className="text-gray-600">Estamos validando la transacción con WebPay.</p>
          </>
        )}

        {estado.status === 'error' && (
          <>
            <XCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-neutral-800">Hubo un problema</h2>
            <p className="text-gray-600">{estado.message}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded transition"
            >
              Volver al inicio
            </button>
          </>
        )}

        {estado.status === 'success' && (
          <>
            {isPagoExitoso ? (
              <CheckCircleIcon className="w-16 h-16 text-lime-500 mx-auto mb-4" />
            ) : (
              <ExclamationCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}

            <h2
              className={`text-xl font-bold mb-2 ${
                isPagoExitoso ? 'text-lime-600' : 'text-neutral-700'
              }`}
            >
              {isPagoExitoso ? '¡Pago exitoso!' : 'Pago no confirmado'}
            </h2>

            <p className="text-gray-700">
              {isPagoExitoso
                ? 'Gracias por tu compra. Aquí tienes el resumen:'
                : 'No se pudo confirmar tu pago. Si el monto fue descontado, contáctanos.'}
            </p>

            {/* Imagen */}
            <div className="mt-6">
              <img
                src="/assets/global/logo_plant.png"
                alt="Logo"
                className={`w-24 h-24 mb-6 mx-auto ${
                  isPagoExitoso ? '' : 'grayscale'
                }`}
              />
            </div>

            {/* Datos de la orden */}
            <div className="text-left text-sm text-gray-800 space-y-2 border-t border-gray-200 pt-4">
              <p>
                <strong>ID Orden:</strong> {estado.data?.order?.id ?? 'N/A'}
              </p>
              <p>
                <strong>Estado de pago:</strong> {estado.data?.payment_status ?? 'Desconocido'}
              </p>
              <p>
                <strong>Total:</strong> {formatCLP(Number(estado.data?.order?.amount ?? 0))}
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded transition"
            >
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
