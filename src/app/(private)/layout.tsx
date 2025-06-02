'use client';

import Footer from '../components/global/Footer';
import Header from '../components/global/Header';
import { useEffect } from 'react';
import LoadingSpinner from '../components/global/LoadingSpinner';
import useStore, { useInitMobileDetection } from '@/stores/base';

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
  } = useStore();
  useInitMobileDetection();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  return (
    <>
      <div className="flex flex-col min-h-dvh">
        {/* Navbar */}
        <Header carro={cartProducts} />

        <main className="flex-grow relative w-full py-3 bg-slate-100 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
