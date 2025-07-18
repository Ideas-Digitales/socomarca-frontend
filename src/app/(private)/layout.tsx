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
        {/* Admin/Superadmin return button */}
        {isAdminUser && (
          <a
            href={user?.roles?.includes('admin') ? '/admin/total-de-ventas' : '/super-admin/users'}
            className="fixed z-50 bottom-6 right-6 flex items-center gap-2 bg-[#007f00] hover:bg-[#003200] text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg transition-colors duration-200"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            {/* Use a generic icon for now, you can import ArrowUturnLeftIcon if needed */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75L3.75 10.5m0 0L9 5.25m-5.25 5.25h12A6.75 6.75 0 0121 17.25v.75" /></svg>
            Volver al panel de administración
          </a>
        )}
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
              <div className={isAdminUser ? 'admin-readonly-mode' : ''}>
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
