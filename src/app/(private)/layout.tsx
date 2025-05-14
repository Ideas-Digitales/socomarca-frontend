'use client';

import Footer from '../components/global/Footer';
import Header from '../components/global/Header';
import NavbarTest from '../components/global/NavbarTest';
import { useEffect } from 'react';
import Search from '../components/global/Search';
import useStore, { useInitMobileDetection } from '@/stores/useStore';
import LoadingSpinner from '../components/global/LoadingSpinner';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, filteredProducts, fetchProducts } = useStore();
  useInitMobileDetection();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <div className="flex flex-col min-h-dvh">
        {/* Navbar */}
        <Header carro={filteredProducts} />
        <Search />

        <NavbarTest />
        <main className="flex-grow relative w-full">
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
