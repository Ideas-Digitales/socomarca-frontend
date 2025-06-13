'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function confirmacionPagoPage() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_ws = params.get('token_ws');
    setToken(token_ws);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {token ? (
          <>
            <h2 className="text-lg font-semibold text-green-600">¡Pago completado!</h2>
            <p className="mt-2 text-gray-700">Recibimos tu token de Webpay:</p>
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm break-all text-gray-800">
              {token}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-red-600">Token no recibido</h2>
            <p className="mt-2 text-gray-700">No pudimos encontrar el token de Webpay en la URL.</p>
          </>
        )}
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
