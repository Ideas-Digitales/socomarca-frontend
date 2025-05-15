'use client';

import ProductCard from './ProductCard';
import ProductCardGrid from './ProductCardGrid';
import CategoryFilterDesktop from './CategoryFilterDesktop';
import useStore from '@/stores/useStore';
import CartProductsDesktop from './CartProductsDesktop';
import Pagination from '../global/Pagination';
import { ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import CartsProductsMobile from './CartsProductsMobile';

export default function ProductsContainer() {
  const { isTablet, filteredProducts, isMobile } = useStore();
  // Inicializar con 'list' por defecto, o basado en isMobile
  const [currentView, setCurrentView] = useState(() =>
    isMobile ? 'list' : 'grid'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Opcional: desplazar al inicio de los productos
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Efecto para actualizar la vista cuando cambia isMobile
  useEffect(() => {
    if (isMobile) {
      setCurrentView('list');
    }
  }, [isMobile]);

  const handleViewChange = (view: string) => {
    // Solo permitir cambiar la vista si no estamos en móvil
    if (!isMobile) {
      setCurrentView(view);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4">
      {!isTablet && <CategoryFilterDesktop />}

      <div className="flex-1 space-y-2 mb-2">
        {!isTablet && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              Arroz y legumbres ({filteredProducts.length} productos)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('list')}
                className={`p-2 rounded-md cursor-pointer ${
                  currentView === 'list' ? 'bg-gray-200' : ''
                } ${isMobile ? 'opacity-50' : ''}`}
                disabled={isMobile}
              >
                <ListBulletIcon width={24} height={24} />
              </button>
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-2 rounded-md cursor-pointer ${
                  currentView === 'grid' ? 'bg-gray-200' : ''
                } ${isMobile ? 'opacity-50' : ''}`}
                disabled={isMobile}
              >
                <ViewColumnsIcon width={24} height={24} />
              </button>
            </div>
          </div>
        )}

        <div
          className={`
          ${
            currentView === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center'
              : 'flex flex-col gap-[2px]'
          }
        `}
        >
          {currentProducts.map((product) =>
            currentView === 'list' ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductCardGrid key={product.id} product={product} />
            )
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {isTablet && <CartsProductsMobile />}
      {!isTablet && <CartProductsDesktop />}
    </div>
  );
}
