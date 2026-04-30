'use client';

import { useEffect, useRef, useState } from 'react';
import { createOrderFromCart } from '@/services/actions/order.actions';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useRouter } from 'next/navigation';
import useStore from '@/stores/base';

interface CreditPaymentResult {
  orderId: number;
  authCode: string;
  amount: number;
  paidAt: string;
  paymentMethodName: string;
}

export default function RedireccionandoPago() {
  const router = useRouter();
  const { fetchCartProducts } = useStore();
  const [creditResult, setCreditResult] = useState<CreditPaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blockedCreditLine, setBlockedCreditLine] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const paymentMethod = localStorage.getItem('paymentMethod') ?? 'transbank';
    const id = localStorage.getItem('selectedAddressId');

    if (!id) {
      setError('No se encontró una dirección de envío seleccionada');
      return;
    }

    const shippingAddressId = Number(id);

    const process = async () => {
      try {
        console.log('[redirect] Enviando a /orders/pay:', { address_id: shippingAddressId, payment_method: paymentMethod });
        const result = await createOrderFromCart({ shippingAddressId, paymentMethod });
        console.log('[redirect] Respuesta:', result);

        if (!result.ok) {
          const message: string = result.body?.message ?? 'Error al procesar el pago';
          if (/línea de crédito.*bloqueada/i.test(message)) {
            setBlockedCreditLine(true);
          } else {
            setError(message);
          }
          return;
        }

        const json = result.body;
        localStorage.removeItem('paymentMethod');
        localStorage.removeItem('selectedAddressId');
        await fetchCartProducts();

        if (paymentMethod === 'transbank') {
          const { payment_url, token: webpayToken } = json.data;
          if (!payment_url || !webpayToken) throw new Error('No se obtuvo la URL ni el token de pago');

          const form = document.createElement('form');
          form.method = 'POST';
          form.action = payment_url;
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'token_ws';
          input.value = webpayToken;
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        } else {
          const payment = json.data.payment;
          setCreditResult({
            orderId: payment.order.id,
            authCode: payment.auth_code,
            amount: payment.amount,
            paidAt: payment.paid_at,
            paymentMethodName: payment.payment_method.name,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al procesar el pago');
      }
    };

    process();
  }, []);

  if (blockedCreditLine) {
    return (
      <div className="flex flex-col items-center bg-[#f1f5f9] text-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 5.25a.75.75 0 0 0-1.5 0v5.25c0 .2.08.39.22.53l3.5 3.5a.75.75 0 1 0 1.06-1.06l-3.28-3.28V7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Línea de crédito en uso</h2>
          <p className="text-gray-600 mb-2">
            Tienes un pago anterior con Línea de Crédito que aún se está procesando.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Espera a que se complete antes de generar una nueva compra con este método.
          </p>
          <button
            onClick={() => router.push('/mi-cuenta?section=compras')}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded mb-2"
          >
            Ver mis pedidos
          </button>
          <button
            onClick={() => router.push('/finalizar-compra')}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded"
          >
            Volver a finalizar compra
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center bg-[#f1f5f9] text-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-2 text-red-600">Error al procesar el pago</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/finalizar-compra')}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  if (creditResult) {
    const formatCLP = (value: number) =>
      value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

    const formatDate = (iso: string) =>
      new Date(iso).toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    return (
      <div className="flex flex-col items-center bg-[#f1f5f9] text-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-lime-100 text-lime-600 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1">¡Pago aprobado!</h2>
          <p className="text-gray-500 text-sm mb-6">Tu compra fue realizada con éxito</p>

          <div className="space-y-2 mb-6 text-left">
            <div className="flex justify-between bg-[#edf2f7] px-4 py-2 rounded text-sm">
              <span className="text-gray-600">N° Pedido</span>
              <span className="font-semibold text-gray-800">#{creditResult.orderId}</span>
            </div>
            <div className="flex justify-between bg-[#edf2f7] px-4 py-2 rounded text-sm">
              <span className="text-gray-600">Método de pago</span>
              <span className="font-semibold text-gray-800">{creditResult.paymentMethodName}</span>
            </div>
            <div className="flex justify-between bg-[#edf2f7] px-4 py-2 rounded text-sm">
              <span className="text-gray-600">Código de autorización</span>
              <span className="font-semibold text-gray-800 font-mono text-xs">{creditResult.authCode}</span>
            </div>
            <div className="flex justify-between bg-[#edf2f7] px-4 py-2 rounded text-sm">
              <span className="text-gray-600">Total pagado</span>
              <span className="font-semibold text-lime-600">{formatCLP(creditResult.amount)}</span>
            </div>
            <div className="flex justify-between bg-[#edf2f7] px-4 py-2 rounded text-sm">
              <span className="text-gray-600">Fecha</span>
              <span className="font-semibold text-gray-800">{formatDate(creditResult.paidAt)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/mi-cuenta?section=compras')}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[#f1f5f9] text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoadingSpinner />
        <h2 className="text-xl font-bold mb-2 mt-5">Procesando pago...</h2>
        <p className="text-gray-600">
          {typeof window !== 'undefined' && localStorage.getItem('paymentMethod') === 'transbank'
            ? 'Estamos creando tu orden y preparando el pago con WebPay.'
            : 'Estamos aplicando el cargo a tu método de pago.'}
        </p>
      </div>
    </div>
  );
}
