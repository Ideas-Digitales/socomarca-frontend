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
    resetSearchRelatedStates,
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

  // CÓDIGO ANTERIOR COMENTADO PARA REFERENCIA:
  // const getCarouselImages = () => {
  //   if (customerMessage?.banner?.desktop_image && customerMessage?.banner?.mobile_image) {
  //     // Si hay imágenes del banner configuradas, usarlas
  //     return [customerMessage.banner.desktop_image, customerMessage.banner.mobile_image];
  //   }
  //   // Si no hay imágenes configuradas, usar las imágenes por defecto
  //   return defaultImages;
  // };

  // NUEVO CÓDIGO: Determinar qué datos usar para el banner
  const getBannerData = () => {
    if (
      customerMessage?.banner?.desktop_image &&
      customerMessage?.banner?.mobile_image
    ) {
      // Si hay datos del banner configurados, usar el objeto completo
      return customerMessage.banner;
    }
    // Si no hay banner configurado, retornar undefined para usar fallback
    return undefined;
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

        {/* Mostrar skeleton mientras carga, o banner si está habilitado */}
        {isLoadingCustomerMessage ? (
          <CarouselSkeleton />
        ) : (
          customerMessage?.banner?.enabled && (
            /* CÓDIGO ANTERIOR COMENTADO:
            <Caroussel images={getCarouselImages()} />
            */
            // NUEVO CÓDIGO: Pasa el objeto banner completo y fallback
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
