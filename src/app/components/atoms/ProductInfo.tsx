import { formatCurrency } from '@/utils/formatCurrency';

interface ProductInfoProps {
  brand: {
    name: string;
  };
  name: string;
  price: number | null | undefined;
  stock?: number;
  sku?: string;
  variant?: 'list' | 'grid' | 'cart';
  truncateLength?: {
    brand?: number;
    name?: number;
  };
}

export default function ProductInfo({
  brand,
  name,
  price,
  stock,
  sku,
  variant = 'list',
  truncateLength = {}
}: ProductInfoProps) {
  const {
    brand: brandTruncateLength = variant === 'cart' ? 10 : 30,
    name: nameTruncateLength = variant === 'cart' ? 10 : variant === 'grid' ? 25 : 30
  } = truncateLength;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };


  const getTextAlignment = () => {
    switch (variant) {
      case 'grid':
        return 'text-center';
      case 'cart':
        return 'text-left';
      case 'list':
      default:
        return 'text-center sm:text-left';
    }
  };

  const getBrandName = () => {
    const truncatedBrand = truncateText(brand.name, brandTruncateLength);
    const shouldShowTooltip = brand.name.length > brandTruncateLength;
    
    return {
      text: truncatedBrand,
      showTooltip: shouldShowTooltip,
      fullText: brand.name
    };
  };

  const getProductName = () => {
    const truncatedName = truncateText(name, nameTruncateLength);
    const shouldShowTooltip = name.length > nameTruncateLength;
    
    return {
      text: truncatedName,
      showTooltip: shouldShowTooltip,
      fullText: name
    };
  };

  const brandInfo = getBrandName();
  const nameInfo = getProductName();
  const textAlignment = getTextAlignment();

  if (variant === 'cart') {
    return (
      <div className="flex flex-col min-w-0 flex-shrink-0 w-[80px]">
        <span
          className={`text-[#64748B] text-[12px] font-medium cursor-help truncate ${
            brandInfo.showTooltip ? 'cursor-help' : ''
          }`}
          title={brandInfo.showTooltip ? brandInfo.fullText : undefined}
        >
          {brandInfo.text}
        </span>
        <span
          className={`text-[12px] font-medium cursor-help truncate ${
            nameInfo.showTooltip ? 'cursor-help' : ''
          }`}
          title={nameInfo.showTooltip ? nameInfo.fullText : undefined}
        >
          {nameInfo.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${variant === 'grid' ? 'w-full items-center' : ''}`}>
      <span className={`text-[#64748B] ${variant === 'list' ? 'text-[12px]' : 'text-xs'} font-medium ${textAlignment}`}>
        {brandInfo.text}
      </span>
      <span data-cy="product-name" className={`${variant === 'list' ? 'text-[12px]' : 'text-sm'} font-medium ${textAlignment}`}>
        {nameInfo.text}
      </span>
      <span data-cy="product-price" className={`text-lime-500 font-bold ${textAlignment} text-lg mt-1`}>
        {price != null ? formatCurrency(price) : '-'}
      </span>
      
      {(stock !== undefined || sku) && variant === 'grid' && (
        <div className="w-full px-2 py-1 text-center">
          {stock !== undefined && (
            <p className="text-[#64748B] text-xs">
              <span className="font-semibold">Stock:</span> {stock}
            </p>
          )}
          {sku && (
            <p className="text-[#64748B] text-xs">
              <span className="font-semibold">SKU:</span> {sku}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
