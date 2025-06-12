'use client';

import ProductCard from './ProductCard';
import ProductCardGrid from './ProductCardGrid';
import CategoryFilterDesktop from './CategoryFilterDesktop';
import CartProductsDesktop from './CartProductsDesktop';
import Pagination from '../global/Pagination';
import { ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import CartsProductsMobile from './CartsProductsMobile';
import useStore from '@/stores/base';

export default function ProductsContainer() {
  const {
    isTablet,
    filteredProducts,
    isMobile,
    productPaginationMeta,
    productPaginationLinks,
    setProductPage,
    isLoadingProducts,
    viewMode,
    setViewMode,
  } = useStore();

  const handlePageChange = (pageNumber: number) => {
    setProductPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
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
                  viewMode === 'list' ? 'bg-gray-200' : ''
                } ${isMobile ? 'opacity-50' : ''}`}
                disabled={isMobile}
              >
                <ListBulletIcon width={24} height={24} />
              </button>
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-2 rounded-md cursor-pointer ${
                  viewMode === 'grid' ? 'bg-gray-200' : ''
                } ${isMobile ? 'opacity-50' : ''}`}
                disabled={isMobile}
              >
                <ViewColumnsIcon width={24} height={24} />
              </button>
            </div>
          </div>
        )}

        {isLoadingProducts ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div
            className={`
            ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center'
                : 'flex flex-col gap-[2px]'
            }
          `}
          >
            {filteredProducts.map((product, index) =>
              viewMode === 'list' ? (
                <ProductCard key={index} product={product} />
              ) : (
                <ProductCardGrid key={index} product={product} />
              )
            )}
          </div>
        )}

        {productPaginationMeta &&
          !isLoadingProducts &&
          filteredProducts.length > 0 && (
            <Pagination
              meta={productPaginationMeta}
              links={productPaginationLinks}
              onPageChange={handlePageChange}
            />
          )}
      </div>

      {isTablet && <CartsProductsMobile />}
      {!isTablet && <CartProductsDesktop />}
    </div>
  );
}
