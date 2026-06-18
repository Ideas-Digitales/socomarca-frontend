'use client';

import { useEffect, useMemo, useState } from 'react';

interface BannerSlide {
  id?: string;
  desktop_image: string;
  mobile_image: string;
  alt?: string;
  order?: number;
  enabled?: boolean;
}

interface BannerData {
  enabled: boolean;
  slides?: BannerSlide[];
  desktop_image?: string;
  mobile_image?: string;
}

interface CarouselProps {
  banner?: BannerData;
  desktopImage?: string;
  mobileImage?: string;
  images?: string[];
}

const AUTOPLAY_MS = 5000;

export default function Carousel({ banner, desktopImage, mobileImage, images }: CarouselProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);

    checkIsMobile();
    setPrefersReducedMotion(motionQuery.matches);

    window.addEventListener('resize', checkIsMobile);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const slides = useMemo(() => {
    const bannerSlides = banner?.slides?.length
      ? banner.slides
      : banner?.desktop_image || banner?.mobile_image
        ? [{
            id: 'legacy-banner',
            desktop_image: banner.desktop_image || '',
            mobile_image: banner.mobile_image || '',
            alt: 'Banner principal',
            order: 1,
            enabled: true,
          }]
        : [];

    const enabledSlides = bannerSlides
      .filter((slide) => slide.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (enabledSlides.length > 0) {
      return enabledSlides;
    }

    if (desktopImage || mobileImage) {
      return [{ desktop_image: desktopImage || '', mobile_image: mobileImage || '', alt: 'Banner principal' }];
    }

    return (images || []).map((image, index) => ({
      id: `fallback-${index}`,
      desktop_image: image,
      mobile_image: image,
      alt: `Banner ${index + 1}`,
      order: index + 1,
      enabled: true,
    }));
  }, [banner, desktopImage, mobileImage, images]);

  const isBannerEnabled = banner?.enabled !== false;
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides || isPaused || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, isPaused, prefersReducedMotion, slides.length]);

  if (!isBannerEnabled) {
    return null;
  }

  if (!slides.length) {
    return (
      <div className="w-full max-w-7xl h-[200px] sm:h-[344px] mx-auto px-4">
        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200">
          <p className="text-gray-500">No hay imagen para mostrar</p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => setCurrentIndex((index) => (index - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentIndex((index) => (index + 1) % slides.length);

  return (
    <section
      className="w-full max-w-7xl h-[200px] sm:h-[344px] mx-auto relative px-4"
      aria-label="Banner principal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="w-full h-full overflow-hidden rounded-lg bg-white">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const image = isMobile ? slide.mobile_image || slide.desktop_image : slide.desktop_image || slide.mobile_image;

            return (
              <div key={slide.id || index} className="w-full h-full flex-shrink-0">
                <img
                  src={image}
                  alt={slide.alt || `Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 min-h-11 min-w-11 rounded-full bg-white/80 text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Banner siguiente"
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 min-h-11 min-w-11 rounded-full bg-white/80 text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id || index}
                type="button"
                aria-label={`Ver banner ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 ${
                  currentIndex === index ? 'bg-lime-500' : 'bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
