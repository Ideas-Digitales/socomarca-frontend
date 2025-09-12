'use client';

import { useState, useEffect, useRef } from 'react';

interface BannerData {
  desktop_image: string;
  mobile_image: string;
  enabled: boolean;
}

interface CarouselProps {
  // Objeto banner del backend
  banner?: BannerData;
  // Props individuales (alternativa)
  desktopImage?: string;
  mobileImage?: string;
  // Mantener compatibilidad con la prop anterior (deprecated)
  images?: string[];
  modalData?: {
    image: string;
    enabled: boolean;
  };
}

export default function Carousel({ banner, desktopImage, mobileImage, images, modalData }: CarouselProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      const newIsMobile = width < 768; // Tailwind md breakpoint
      console.log('📱 Detección de dispositivo:', {
        windowWidth: width,
        isMobile: newIsMobile,
        breakpoint: 768,
        deviceType: newIsMobile ? 'MÓVIL' : 'DESKTOP'
      });
      setIsMobile(newIsMobile);
    };
    
    // Verificar al montar el componente
    checkIsMobile();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Determinar qué imagen usar basándose en el dispositivo (reactivo)
  useEffect(() => {
    console.log('🖼️ Selección de imagen (useEffect):', {
      isMobile,
      'banner?.desktop_image': banner?.desktop_image,
      'banner?.mobile_image': banner?.mobile_image,
      hasBannerImages: !!(banner?.desktop_image && banner?.mobile_image),
      desktopImage,
      mobileImage,
      hasIndividualProps: !!(desktopImage && mobileImage),
      fallbackImage: images?.[0]
    });

    let selectedImage = '';

    // Prioridad 1: Usar el objeto banner del backend
    if (banner?.desktop_image && banner?.mobile_image) {
      selectedImage = isMobile ? banner.mobile_image : banner.desktop_image;
      console.log('✅ Usando banner del backend:', {
        isMobile,
        selectedImage,
        source: isMobile ? 'mobile_image' : 'desktop_image'
      });
    }
    // Prioridad 2: Usar props individuales
    else if (desktopImage && mobileImage) {
      selectedImage = isMobile ? mobileImage : desktopImage;
      console.log('✅ Usando props individuales:', {
        isMobile,
        selectedImage,
        source: isMobile ? 'mobileImage prop' : 'desktopImage prop'
      });
    }
    // Fallback: Primera imagen del array original para compatibilidad
    else {
      selectedImage = images?.[0] || '';
      console.log('✅ Usando fallback:', {
        selectedImage,
        source: 'images[0]'
      });
    }

    setCurrentImage(selectedImage);
  }, [isMobile, banner?.desktop_image, banner?.mobile_image, desktopImage, mobileImage, images]);

  // Verificar si el banner está habilitado
  const isBannerEnabled = banner?.enabled !== false; // Por defecto true si no se especifica

  // Console log para debug (detallado)
  useEffect(() => {
    console.log('🔍 Banner Debug - Datos actuales:', {
      // Detección de dispositivo
      isMobile,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'undefined',
      breakpoint: 768,
      
      // Datos del banner
      banner,
      'banner.desktop_image': banner?.desktop_image,
      'banner.mobile_image': banner?.mobile_image,
      'banner.enabled': banner?.enabled,
      
      // Props individuales
      desktopImage,
      mobileImage,
      
      // Imagen seleccionada
      currentImage,
      imageSource: banner?.desktop_image && banner?.mobile_image 
        ? 'banner object' 
        : desktopImage && mobileImage 
          ? 'individual props'
          : 'fallback images array',
      
      // Estado
      isBannerEnabled,
      modalData
    });
  }, [currentImage, banner, desktopImage, mobileImage, isMobile, isBannerEnabled, modalData]);

  // No mostrar nada si el banner está deshabilitado
  if (!isBannerEnabled) {
    return null;
  }

  // Mostrar placeholder si no hay imagen
  if (!currentImage) {
    return (
      <div className="w-full max-w-7xl h-[144px] sm:h-[344px] mx-auto px-4">
        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200">
          <p className="text-gray-500">No hay imagen para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl sm:h-[344px] h-[200px] mx-auto relative px-4">
      {/* Container de imagen con bordes redondeados */}
      <div className="w-full h-full overflow-hidden rounded-lg">
        {/* 
        // CÓDIGO ANTERIOR DEL CARRUSEL COMENTADO PARA REFERENCIA FUTURA:
        // Este era el código que renderizaba un carrusel con múltiples imágenes
        // <div
        //   className="flex transition-transform duration-500 ease-in-out w-full h-full"
        //   style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        // >
        //   {images.map((image, index) => (
        //     <div key={index} className="w-full h-full flex-shrink-0">
        //       <img
        //         src={image}
        //         alt={`Slide ${index + 1}`}
        //         className="w-full h-full object-cover"
        //       />
        //     </div>
        //   ))}
        // </div>
        // 
        // + Botones de navegación
        // + Indicadores
        // + Autoplay
        */}
        
        {/* NUEVO CÓDIGO: Renderiza imagen del backend específica según el dispositivo */}
        <img
          src={currentImage}
          alt={`Banner - ${isMobile ? 'Móvil' : 'Desktop'}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
