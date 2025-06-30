'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { getWebpayPaymentDetail } from '@/services/actions/payment.actions';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';

type Estado =
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; message: string };

export default function ConfirmacionPagoPage() {
  const [estado, setEstado] = useState<Estado>({ status: 'loading' });
  const [copiado, setCopiado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token_ws = new URLSearchParams(window.location.search).get('token_ws');
    if (!token_ws) {
      setEstado({ status: 'error', message: 'No se pudo completar la operación de pago.' });
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

  const isPagoExitoso =
    estado.status === 'success' &&
    estado.data?.success === true &&
    estado.data?.data?.status === 'AUTHORIZED';

  const handleCopiar = () => {
  if (estado.status !== 'success' || !estado.data?.data) return;

  const { message } = estado.data;
  const {
    status,
    authorization_code,
    payment_type_code,
    installments_number,
    card_number,
    accounting_date,
    transaction_date,
  } = estado.data.data;

  const texto = `
Mensaje: ${message}
Estado: ${status}
Código de autorización: ${authorization_code}
Tipo de pago: ${payment_type_code}
Número de cuotas: ${installments_number}
Últimos dígitos tarjeta: **** **** **** ${card_number}
Fecha contable: ${accounting_date}
Fecha transacción: ${new Date(transaction_date).toLocaleString('es-CL')}
`.trim();

  navigator.clipboard.writeText(texto);
  setCopiado(true);
  setTimeout(() => setCopiado(false), 2000);
};


  return (
    <div className="flex flex-col items-center justify-center bg-[#f1f5f9] text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {estado.status === 'loading' && (
          <>
            <LoadingSpinner />
            <h2 className="text-xl font-bold mb-2 mt-5 text-neutral-900">
              Confirmando tu pago...
            </h2>
            <p className="text-gray-600">
              Estamos validando la transacción con WebPay.
            </p>
          </>
        )}

        {estado.status === 'error' && (
          <>
            <XCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-neutral-800">
              Hubo un problema
            </h2>
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
                : estado.data?.message ||
                  'No se pudo confirmar tu pago. Si el monto fue descontado, contáctanos.'}
            </p>

            <div className="mt-6">
              <img
                src="/assets/global/logo_plant.png"
                alt="Logo"
                className={`w-24 h-24 mb-6 mx-auto ${isPagoExitoso ? '' : 'grayscale'}`}
              />
            </div>

            {estado.data?.order && (
              <div className="text-left text-sm text-gray-800 space-y-2 border-t border-gray-200 pt-4">
                <p>
                  <strong>ID Orden:</strong> {estado.data.order.id}
                </p>
                <p>
                  <strong>Total:</strong>{' '}
                  {formatCLP(Number(estado.data.order.amount ?? 0))}
                </p>
              </div>
            )}

            {estado.data?.data && (
              <details open className="mt-6 text-sm text-gray-700 bg-gray-100 rounded p-4">
                <summary className="cursor-pointer font-medium text-neutral-800 mb-3">
                  Detalle técnico de la transacción
                </summary>
                <div className="space-y-1 text-left">
                  <p>
                    <strong>Mensaje:</strong> {estado.data.message}
                  </p>
                  <p>
                    <strong>Estado:</strong> {estado.data.data.status}
                  </p>
                  <p>
                    <strong>Código de autorización:</strong>{' '}
                    {estado.data.data.authorization_code}
                  </p>
                  <p>
                    <strong>Tipo de pago:</strong> {estado.data.data.payment_type_code}
                  </p>
                  <p>
                    <strong>Número de cuotas:</strong>{' '}
                    {estado.data.data.installments_number}
                  </p>
                  <p>
                    <strong>Últimos dígitos tarjeta:</strong> **** **** ****{' '}
                    {estado.data.data.card_number}
                  </p>
                  <p>
                    <strong>Fecha contable:</strong>{' '}
                    {estado.data.data.accounting_date}
                  </p>
                  <p>
                    <strong>Fecha transacción:</strong>{' '}
                    {new Date(estado.data.data.transaction_date).toLocaleString('es-CL')}
                  </p>

                 <button
  onClick={handleCopiar}
  className="flex items-center gap-2 mt-4 text-sm text-lime-600 hover:underline"
>
  <ClipboardIcon className="w-4 h-4" />
  {copiado ? 'Copiado ✔' : 'Copiar detalle'}
</button>

                </div>
              </details>
            )}

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
