'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccesoDenegado() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el rol del usuario desde las cookies
    const cookies = document.cookie.split(';');
    const roleCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('role=')
    );
    if (roleCookie) {
      setUserRole(roleCookie.split('=')[1]);
    }
  }, []);

  const getRedirectPath = () => {
    switch (userRole) {
      case 'cliente':
        return '/';
      case 'admin':
        return '/admin/total-de-ventas';
      case 'superadmin':
        return '/super-admin/users';
      default:
        return '/login';
    }
  };

  const getAreaName = () => {
    switch (userRole) {
      case 'cliente':
        return 'área privada';
      case 'admin':
        return 'administración';
      case 'superadmin':
        return 'super administración';
      default:
        return 'inicio';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-lime-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes permiso para acceder a esta página.
      </p>
      <Link
        href={getRedirectPath()}
        className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 duration-300 transition-colors text-center text-lg font-medium ease-in-out"
      >
        Volver a {getAreaName()}
      </Link>
    </div>
  );
}
