'use client';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function CompraFallidaPage() {
  const router = useRouter();

  // Simulación de datos
  const numeroOrden = '95491147';

  return (
    <div className="bg-red-50 min-h-[60vh] flex justify-center py-6 md:py-10 px-4">
      <div className="max-w-2xl flex flex-col h-fit p-8 rounded-lg text-center gap-[25px]">
        <div className="flex justify-center">
          <ExclamationCircleIcon width={64} height={64} className='text-red-600' />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          No hemos podido procesar <br /> tu pago
        </h1>

        <p className="text-lg">
          Número de orden: <span className="text-red-500">{numeroOrden}</span>
        </p>
        <p className="text-lg">Reintenta en unos minutos</p>

        <button
          onClick={() => router.push('/carro-de-compra')}
          className="mt-4 hover:bg-slate-50 border-slate-400 border text-slate-400 py-2 px-6 rounded text-lg"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  );
}
