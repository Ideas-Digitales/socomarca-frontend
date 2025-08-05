import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sin conexión a internet
          </h1>
          <p className="text-gray-600 mb-8">
            No tienes conexión a internet. Algunas funciones pueden no estar disponibles.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Reintentar
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Algunas páginas pueden estar disponibles sin conexión</p>
        </div>
      </div>
    </div>
  );
} 