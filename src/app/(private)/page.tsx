'use client';

import useStore from '@/stores/useStore';
import ProductsContainer from '../components/products/ProductsContainer';
import GPSPosition from '../components/global/GPSPosition';
import CategoryFilterMobile from '../components/products/CategoryFilterMobile';

export default function PrivatePage() {
  const { isTablet } = useStore();
  return (
    <div className="bg-slate-100 sm:py-7">
      {isTablet && <GPSPosition />}
      <div className="mx-auto">
        {isTablet && <CategoryFilterMobile />}

        <ProductsContainer />
      </div>
    </div>
  );
}
