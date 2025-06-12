'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { createOrderFromCart } from '@/services/actions/order.actions';

export default function RedireccionandoPago() {
  const router = useRouter();

  useEffect(() => {
    const createOrderAndRedirect = async () => {
      try {
        await createOrderFromCart();
        router.push('/webpay'); 
      } catch (error) {
        console.error('Error al crear la orden:', error);
      }
    };

    createOrderAndRedirect();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center bg-[#f1f5f9] text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoadingSpinner />
        <h2 className="text-xl font-bold mb-2">Redireccionando al portal de pago...</h2>
        <p className="text-gray-600">Estamos creando tu orden y preparando el pago con WebPay.</p>
      </div>
    </div>
  );
}
