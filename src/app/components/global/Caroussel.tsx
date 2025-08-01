'use client';

import { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  images: string[];
  modalData?: {
    image: string;
    enabled: boolean;
  };
}

export default function Carousel({ images, modalData }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const prevImagesRef = useRef<string[] | undefined>(undefined);

  // Console log para ver qué datos llegan al componente (solo cuando cambian las imágenes)
  useEffect(() => {
    // Comparar si las imágenes realmente cambiaron
    const prevImages = prevImagesRef.current;
    const imagesChanged = !prevImages || 
      prevImages.length !== images?.length || 
      JSON.stringify(prevImages) !== JSON.stringify(images);
    
    if (imagesChanged) {
      console.log('Carousel - Datos recibidos:', {
        images,
        imagesLength: images?.length,
        imagesType: typeof images,
        isArray: Array.isArray(images),
        firstImage: images?.[0],
        allImages: images,
        modalData,
        modalEnabled: modalData?.enabled,
        modalImage: modalData?.image
      });
      prevImagesRef.current = images;
    }
  }, [images, modalData]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-7xl h-[144px] sm:h-[344px] mx-auto px-4">
        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200">
          <p className="text-gray-500">No hay imágenes para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl sm:h-[344px] h-[200px] mx-auto relative px-4">
      {/* Container de imágenes con overflow y bordes redondeados */}
      <div className="w-full h-full overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación - solo se muestran si hay más de una imagen */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors duration-200 z-10"
            aria-label="Imagen anterior"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors duration-200 z-10"
            aria-label="Imagen siguiente"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
