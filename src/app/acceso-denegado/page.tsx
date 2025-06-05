import Link from 'next/link';

export default function AccesoDenegado() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-lime-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes permiso para acceder a esta página.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 duration-300 transition-colors text-center text-lg font-medium ease-in-out"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
