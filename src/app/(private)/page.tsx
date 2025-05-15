'use client';

import useStore from '@/stores/useStore';
import ProductsContainer from '../components/products/ProductsContainer';
import GPSPosition from '../components/global/GPSPosition';
import CategoryFilterMobile from '../components/products/CategoryFilterMobile';
import Search from '../components/global/Search';

export default function PrivatePage() {
  const { isTablet } = useStore();
  return (
    <div className="bg-slate-100 sm:py-7">
      <Search/>

      {isTablet && <GPSPosition />}
      <div className="mx-auto">
        {isTablet && <CategoryFilterMobile />}

        <ProductsContainer />
      </div>
    </div>
  );
}
