'use client';

import useStore from '@/stores/base';
import ProductsContainer from '../components/products/ProductsContainer';
import CategoryFilterMobile, {
  CategoryFilterMobileButton,
} from '../components/products/CategoryFilterMobile';
import Search from '../components/global/Search';
import Caroussel from '../components/global/Caroussel';
import { useState } from 'react';

const images = [
  '/assets/global/bg-blue.webp',
  '/assets/global/bg-pink.webp',
  '/assets/global/bg-yellow.webp',
];

export default function PrivatePage() {
  const { isTablet, setSearchTerm, resetSearchRelatedStates } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    resetSearchRelatedStates();
  };

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const componentSearch = (
    <Search
      className="bg-white md:bg-slate-100"
      onSearch={handleSearch}
      onClear={handleClearSearch}
      placeholder="Busca productos ahora"
      label="Encuentra justo lo que necesitas con solo un clic en nuestro buscador"
    />
  );

  return (
    <div className="bg-slate-100 sm:py-7">
      <div className="flex flex-col py-4">
        {isTablet && componentSearch}
        <Caroussel images={images} />
        {!isTablet && componentSearch}
      </div>

      <div className="mx-auto space-y-2">
        {isTablet && <CategoryFilterMobileButton onOpen={handleOpenFilter} />}
        {isTablet && (
          <CategoryFilterMobile
            isOpen={isFilterOpen}
            onClose={handleCloseFilter}
          />
        )}

        <ProductsContainer />
      </div>
    </div>
  );
}
