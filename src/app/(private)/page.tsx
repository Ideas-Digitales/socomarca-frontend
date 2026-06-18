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
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    selectedCategories,
    selectedSupercategoryIds,
    selectedCategoryIds,
    selectedSubcategoryIds,
    selectedBrands,
    selectedMinPrice,
    selectedMaxPrice,
    productPaginationMeta,
    showOnlyFavorites,
    fetchProducts,
    customerMessage,
    isLoadingCustomerMessage,
    fetchCustomerMessage,
    openModal,
  } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { getUserRole } = useAuthStore();
  const userRole = getUserRole();

  // Cargar el customer message al montar el componente
  useEffect(() => {
    fetchCustomerMessage();
  }, [fetchCustomerMessage]);

  // Función para validar si una imagen se puede cargar
  const validateImage = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // Efecto para mostrar el modal una única vez si está habilitado
  useEffect(() => {
    const showModalIfValid = async () => {
      // Solo proceder si está habilitado Y hay una imagen válida
      if (
        customerMessage?.modal?.enabled &&
        customerMessage.modal.image &&
        customerMessage.modal.image.trim() !== ''
      ) {
        // Verificar si ya se mostró el modal en esta sesión
        const modalShown = sessionStorage.getItem('welcomeModalShown');

        // Los administradores siempre deben ver el modal
        const isAdmin = userRole === 'admin' || userRole === 'superadmin';
        const shouldShowModal = isAdmin || !modalShown;

        if (shouldShowModal) {
          // Validar que la imagen se puede cargar antes de mostrar el modal
          const isImageValid = await validateImage(customerMessage.modal.image);
          
          if (isImageValid) {
            // Mostrar el modal solo si la imagen es válida
            openModal('', {
              content: (
                <div className="relative">
                  <button
                    onClick={() => {
                      const { closeModal } = useStore.getState();
                      closeModal();
                    }}
                    className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                    aria-label="Cerrar modal"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <img
                    src={customerMessage.modal.image}
                    alt="Mensaje de bienvenida"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '80vh' }}
                  />
                </div>
              ),
              size: 'lg',
            });

            // Solo marcar como mostrado si NO es administrador
            if (!isAdmin) {
              sessionStorage.setItem('welcomeModalShown', 'true');
            }
          }
        }
      }
    };

    showModalIfValid();
  }, [customerMessage, openModal, userRole]);

  const getBannerData = () => {
    if (customerMessage?.banner?.slides?.length) {
      return customerMessage.banner;
    }

    return undefined;
  };

  const buildActiveFilterParams = (): SearchWithPaginationProps => {
    const searchParams: SearchWithPaginationProps = {
      page: 1,
      size: productPaginationMeta?.per_page || 9,
      min: selectedMinPrice,
      max: selectedMaxPrice,
    };

    if (selectedSupercategoryIds.length > 0) {
      searchParams.supercategory_id = selectedSupercategoryIds;
    }

    if (selectedCategoryIds.length > 0) {
      searchParams.category_id = selectedCategoryIds;
    }

    if (selectedSubcategoryIds.length > 0) {
      searchParams.subcategory_id = selectedSubcategoryIds;
    }

    if (selectedBrands.length > 0) {
      searchParams.brand_id = selectedBrands;
    }

    if (showOnlyFavorites) {
      searchParams.is_favorite = true;
    }

    return searchParams;
  };

  const handleSearch = (term: string) => {
    if (!term || term.trim() === '') {
      handleClearSearch();
      return;
    }

    const searchParams: SearchWithPaginationProps = {
      ...buildActiveFilterParams(),
      field: 'name',
      value: term,
      operator: 'fulltext',
    };

    setSearchTerm(searchParams);
  };

  const handleClearSearch = async () => {
    if (
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      showOnlyFavorites ||
      selectedMinPrice > 0 ||
      selectedMaxPrice > 0
    ) {
      setSearchTerm(buildActiveFilterParams());
      return;
    }

    await fetchProducts(1, productPaginationMeta?.per_page || 9);
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

        {/* Mostrar skeleton mientras carga, o banner si está habilitado */}
        {isLoadingCustomerMessage ? (
          <CarouselSkeleton />
        ) : (
          customerMessage?.banner?.enabled && (
            <Caroussel banner={getBannerData()} images={defaultImages} />
          )
        )}

        {/* Franja del mensaje del cliente */}
        {customerMessage?.header?.content &&
          customerMessage.header.content.trim() !== '' && (
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
