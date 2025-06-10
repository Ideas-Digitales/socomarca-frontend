'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import SidebarMobile from '../components/admin/SidebarMobile';
import DescargarDatos from '../components/admin/DescargarDatos';
import useStore, { useInitMobileDetection } from '@/stores/base';
import useAuthStore from '@/stores/useAuthStore';

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useInitMobileDetection();
  const { isTablet, fetchCategories, fetchProducts } = useStore();
  const { getUserRole } = useAuthStore();

  // Obtener el rol del usuario
  const userRole = (getUserRole() as 'admin' | 'superadmin') || 'admin';

  useEffect(() => {
    // Solo fetchear para admin regular, no para superadmin
    if (userRole === 'admin') {
      fetchProducts();
      fetchCategories();
    }
  }, [fetchProducts, fetchCategories, userRole]);

  useEffect(() => {
    setIsMounted(true);

    // Pequeño delay para asegurar que la detección móvil se complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="w-full">
        {/* Sidebar - Solo se renderiza en desktop */}
        {!isTablet && (
          <Sidebar
            configType={userRole} // Usar el rol real como configType
            userRole={userRole}
            userName="Alex Mandarino"
          />
        )}

        {/* Mobile Sidebar - Solo se renderiza en tablet/mobile */}
        {isTablet && (
          <SidebarMobile
            configType={userRole} // Usar el rol real como configType
            userRole={userRole}
          />
        )}

        {/* Main Content Area */}
        <div
          className={`flex flex-col relative min-h-dvh ${
            !isTablet ? 'ml-[290px]' : ''
          }`}
        >
          {/* DescargarDatos solo para admin regular y desktop */}
          {!isTablet && userRole === 'admin' && <DescargarDatos />}

          <main
            className={`flex-grow relative w-full ${
              !isTablet && userRole === 'admin' ? 'py-[88px]' : 'py-[30px]'
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
