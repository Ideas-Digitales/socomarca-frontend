import { useEffect, useState } from 'react';

interface ProductImageProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  variant?: 'list' | 'grid' | 'cart';
}

export default function ProductImage({
  src,
  alt = 'Product image',
  fallbackSrc = '/assets/global/logo_plant.png',
  className = '',
  variant = 'list'
}: ProductImageProps) {
  const [backgroundImage, setBackgroundImage] = useState(`url(${src})`);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onerror = () => {
      setBackgroundImage(`url(${fallbackSrc})`);
    };
  }, [src, fallbackSrc]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'list':
        return 'w-[37px] h-[70px] py-[15px] px-[37px]';
      case 'grid':
        return 'w-full h-[87px]';
      case 'cart':
        return 'w-[45px] h-[46px] p-[2px]';
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center ${getVariantClasses()} ${className}`}
      style={{ backgroundImage }}
      role="img"
      aria-label={alt}
    />
  );
}
