'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { DEFAULT_IMAGE } from '@/utils/assets';

interface ZoomableProductImageProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  zoom?: number;
}

// Imagen de producto con efecto lupa: con mouse se amplía al pasar el cursor y sigue
// su posición; en pantallas táctiles se activa con un toque y se recorre arrastrando
export default function ZoomableProductImage({
  src,
  alt = 'Product image',
  fallbackSrc = DEFAULT_IMAGE,
  className = '',
  zoom = 2,
}: ZoomableProductImageProps) {
  const [backgroundImage, setBackgroundImage] = useState(`url(${src})`);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => {
      setBackgroundImage(`url(${fallbackSrc})`);
    };
  }, [src, fallbackSrc]);

  const updateOrigin = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${Math.min(Math.max(x, 0), 100)}% ${Math.min(Math.max(y, 0), 100)}%`);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    updateOrigin(e);
    setIsZoomed(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' || isZoomed) updateOrigin(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') setIsZoomed(false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    updateOrigin(e);
    setIsZoomed((zoomed) => !zoomed);
  };

  return (
    <div
      className={`relative w-full h-[240px] sm:h-[340px] overflow-hidden rounded-md select-none ${
        isZoomed ? 'cursor-zoom-out touch-none' : 'cursor-zoom-in'
      } ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      role="img"
      aria-label={alt}
    >
      <div
        className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-150 ease-out"
        style={{
          backgroundImage,
          transformOrigin: origin,
          transform: isZoomed ? `scale(${zoom})` : 'scale(1)',
        }}
      />

      {/* Indicativo para el usuario, se oculta mientras la lupa está activa */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/90 p-1.5 text-[#64748B] shadow-sm ring-1 ring-slate-200 transition-opacity duration-150 ${
          isZoomed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <MagnifyingGlassPlusIcon className="h-5 w-5" />
      </span>
    </div>
  );
}
