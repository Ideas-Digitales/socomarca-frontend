'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import SidebarMobile from '../components/admin/SidebarMobile';
import useStore, { useInitMobileDetection } from '@/stores/base';

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

export default function SuperAdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useInitMobileDetection();
  const { isTablet } = useStore();

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
          <Sidebar configType="super-admin" userName="Alex Mandarino" />
        )}

        {/* Mobile Sidebar - Solo se renderiza en tablet/mobile */}
        {isTablet && <SidebarMobile configType="super-admin" />}

        {/* Main Content Area */}
        <div
          className={`flex flex-col relative min-h-dvh ${
            !isTablet ? 'ml-[290px]' : ''
          }`}
        >
          <main className="flex-grow relative w-full py-[88px]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
