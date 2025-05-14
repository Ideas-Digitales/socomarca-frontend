'use client';

import useStore from '@/stores/useStore';
import ProductsContainer from '../components/products/ProductsContainer';
import GPSPosition from '../components/global/GPSPosition';
import CategoryFilterMobile from '../components/products/CategoryFilterMobile';

export default function PrivatePage() {
  const { filteredProducts, isMobile } = useStore();
  return (
    <div className="bg-slate-100 sm:py-7">
      {isMobile && <GPSPosition />}
      <div className="mx-auto">
        {isMobile && <CategoryFilterMobile />}

        <ProductsContainer products={filteredProducts} />
      </div>
    </div>
  );
}
