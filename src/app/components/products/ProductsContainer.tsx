'use client';
import ProductCard from './ProductCard';
import CategoryFilterDesktop from './CategoryFilterDesktop';
import useStore from '@/stores/useStore';
import CartProductsDesktop from './CartProductsDesktop';

export default function ProductsContainer() {
  const { isTablet, filteredProducts } = useStore();

  return (
    <div className="flex items-start gap-4 flex-1-0-0 max-w-7xl mx-auto w-full px-4">
      {!isTablet && <CategoryFilterDesktop />}
      <div className="flex flex-col flex-1-0-0  w-full sm:mr-auto">
        {!isTablet && (
          <div className="flex py-[10px] items-center gap-2 h-[44px]">
            <span className="font-semibold ">
              Arroz y legumbres (180 productos)
              {isTablet && (
                <span className="text-[#64748B] text-[12px] font-medium">
                  isTablet
                </span>
              )}
            </span>
          </div>
        )}
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!isTablet && <CartProductsDesktop />}
    </div>
  );
}
