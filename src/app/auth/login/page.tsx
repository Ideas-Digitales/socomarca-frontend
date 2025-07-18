'use client';

import LoginForm from '@/app/components/auth/LoginForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';

export default function LoginPage() {
  const { isLoggedIn, user, isInitialized } = useAuthStore();
  const router = useRouter();
  
  // Asegurar que el estado de autenticación se inicialice
  useAuthInitialization();

  useEffect(() => {
    // Solo verificar redirección si el estado está inicializado
    if (isInitialized && isLoggedIn && user) {
      const userRoles = user.roles || [];
      
      if (userRoles.includes('admin') || userRoles.includes('superadmin')) {
        router.replace('/admin/total-de-ventas');
      } else {
        router.replace('/');
      }
    }
  }, [isInitialized, isLoggedIn, user, router]);

  // Mostrar loading mientras se inicializa el estado de autenticación
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si ya está logueado y el estado está inicializado, mostrar loading mientras redirige
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <LoginForm
      recoveryLink="/auth/recuperar"
      useWindowLocation={true}
    />
  );
}
