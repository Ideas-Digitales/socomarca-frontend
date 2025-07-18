'use client';

import useStore from '@/stores/base';
import ProductsContainer from '../components/products/ProductsContainer';
import CategoryFilterMobile, {
  CategoryFilterMobileButton,
} from '../components/products/CategoryFilterMobile';
import Search from '../components/global/Search';
import Caroussel from '../components/global/Caroussel';
import CarouselSkeleton from '../components/global/CarouselSkeleton';
import { useState, useEffect } from 'react';
import { SearchWithPaginationProps } from '@/interfaces/product.interface';
import useAuthStore from '@/stores/useAuthStore';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

// Imágenes por defecto para el carrusel
const defaultImages = [
  '/assets/global/bg-blue.webp',
  '/assets/global/bg-pink.webp',
  '/assets/global/bg-yellow.webp',
];

export default function PrivatePage() {
  const { 
    isTablet, 
    searchTerm,
    setSearchTerm, 
    resetSearchRelatedStates,
    customerMessage,
    isLoadingCustomerMessage,
    fetchCustomerMessage
  } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { getUserRole } = useAuthStore();
  const userRole = getUserRole();

  // Cargar el customer message al montar el componente
  useEffect(() => {
    fetchCustomerMessage();
  }, [fetchCustomerMessage]);

  // Determinar qué imágenes usar para el carrusel
  const getCarouselImages = () => {
    if (customerMessage?.banner?.desktop_image && customerMessage?.banner?.mobile_image) {
      // Si hay imágenes del banner configuradas, usarlas
      return [customerMessage.banner.desktop_image, customerMessage.banner.mobile_image];
    }
    // Si no hay imágenes configuradas, usar las imágenes por defecto
    return defaultImages;
  };

  const handleSearch = (term: string) => {
    if (!term || term.trim() === '') {
      handleClearSearch();
      return;
    }

    const searchParams: SearchWithPaginationProps = {
      field: 'name',
      value: term,
      operator: 'fulltext',
      page: 1,
      size: 9,
    };

    setSearchTerm(searchParams);
  };

  const handleClearSearch = async () => {
    await resetSearchRelatedStates();
  };

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const componentSearch = (
    <Search
      className="bg-white md:bg-slate-100"
      onSearch={handleSearch}
      onClear={handleClearSearch}
      placeholder="Busca productos ahora"
      label="Encuentra justo lo que necesitas con solo un clic en nuestro buscador"
    />
  );

  return (
    <div className="bg-slate-100 sm:py-7">
   
    
      <div className="flex flex-col mb-2 sm:py-2 space-y-2">
        {isTablet && componentSearch}
        
        {/* Mostrar skeleton mientras carga, o carrusel si está habilitado */}
        {isLoadingCustomerMessage ? (
          <CarouselSkeleton />
        ) : (
          customerMessage?.banner?.enabled && (
            <Caroussel images={getCarouselImages()} />
          )
        )}
        
        {/* Franja del mensaje del cliente */}
        {customerMessage?.header?.content && customerMessage.header.content.trim() !== "" && (
          <div className="w-full max-w-7xl mx-auto px-4">
            <div 
              className="w-full rounded-lg px-4 py-1 text-center text-white font-medium shadow-sm"
              style={{ backgroundColor: customerMessage.header.color }}
            >
              {customerMessage.header.content}
            </div>
          </div>
        )}
        
        {!isTablet && componentSearch}
      </div>

      <div className="mx-auto space-y-2">
        {isTablet && <CategoryFilterMobileButton onOpen={handleOpenFilter} />}
        {isTablet && (
          <CategoryFilterMobile
            isOpen={isFilterOpen}
            onClose={handleCloseFilter}
          />
        )}

        <ProductsContainer />
      </div>
    </div>
  );
}
