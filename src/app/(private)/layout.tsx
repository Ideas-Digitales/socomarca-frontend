'use client';

import Footer from '../components/global/Footer';
import Header from '../components/global/Header';
import { useEffect } from 'react';
import LoadingSpinner from '../components/global/LoadingSpinner';
import useStore, { useInitMobileDetection } from '@/stores/base';
import { useAuthStore } from '@/stores/useAuthStore';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isLoading,
    fetchProducts,
    fetchCategories,
    cartProducts,
    fetchBrands,
    fetchCartProducts,
  } = useStore();
  const { user } = useAuthStore();
  useInitMobileDetection();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchCartProducts();
  }, [fetchProducts, fetchCategories, fetchBrands, fetchCartProducts]);

  // Verificar si el usuario es admin o superadmin para deshabilitar funcionalidades de compra
  const isAdminUser =
    user?.roles?.includes('admin') || user?.roles?.includes('superadmin');

  return (
    <>
      <div className="flex flex-col min-h-dvh">
        {/* Navbar */}
        <Header carro={cartProducts} />

        <main className="flex-grow relative w-full py-3 bg-slate-100 sm:pt-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {isAdminUser && (
                <div className="w-full max-w-7xl mx-auto px-4 mb-4">
                  <div className="w-full rounded-lg px-4 py-2 text-center text-white font-medium shadow-sm bg-orange-500">
                    Modo de solo lectura - No puedes realizar compras
                  </div>
                </div>
              )}
              <div className={isAdminUser ? 'pointer-events-none' : ''}>
                {children}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
