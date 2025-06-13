'use client';

import { useEffect } from 'react';
import { createOrderFromCart } from '@/services/actions/order.actions';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';

export default function RedireccionandoPago() {
  useEffect(() => {
    const createOrderAndRedirect = async () => {
      try {
        const id = localStorage.getItem('selectedAddressId');
        if (!id) {
          throw new Error('No se encontró una dirección de envío seleccionada');
        }

        const shippingAddressId = Number(id);
        const { payment_url, token } = await createOrderFromCart({ shippingAddressId });

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payment_url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } catch (error) {
        console.error('Error al crear la orden:', error);
      }
    };

    createOrderAndRedirect();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-[#f1f5f9] text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoadingSpinner />
        <h2 className="text-xl font-bold mb-2 mt-5">Redireccionando al portal de pago...</h2>
        <p className="text-gray-600">Estamos creando tu orden y preparando el pago con WebPay.</p>
      </div>
    </div>
  );
}
