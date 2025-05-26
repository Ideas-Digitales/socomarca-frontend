'use client';

import useStore from '@/stores/base';
import ProductsContainer from '../components/products/ProductsContainer';
import GPSPosition from '../components/global/GPSPosition';
import CategoryFilterMobile from '../components/products/CategoryFilterMobile';
import Search from '../components/global/Search';
import Image from 'next/image';
const desktopImage = '/assets/global/banner_desktop.png';
const mobileImage = '/assets/global/banner_mobile.png';

export default function PrivatePage() {
  const { isTablet, setSearchTerm, resetSearchRelatedStates } = useStore();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    resetSearchRelatedStates();
  };
  return (
    <div className="bg-slate-100 sm:py-7">
      <div className="flex items-center rounded-lg max-w-7xl h-auto max-h-[666px] mx-auto">
        <Image
          src={desktopImage}
          height={666}
          width={1184}
          alt="banner"
          style={{
            width: '100%',
            height: 'auto',
          }}
          className="hidden sm:block w-full object-cover py-7 px-4 "
        />
      </div>
      <Search
        className="bg-white md:bg-slate-100"
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder="Busca productos ahora"
        label="Encuentra justo lo que necesitas con solo un clic en nuestro buscador"
      />

      {isTablet && <GPSPosition />}
      <Image
        src={mobileImage}
        height={1080}
        width={1920}
        alt="banner"
        style={{
          width: '100%',
          height: 'auto',
        }}
        className="sm:hidden w-full h-auto object-cover py-2 px-4"
      />
      <div className="mx-auto">
        {isTablet && <CategoryFilterMobile />}

        <ProductsContainer />
      </div>
    </div>
  );
}
