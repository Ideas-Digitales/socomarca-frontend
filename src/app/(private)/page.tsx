'use client';

import useStore from '@/stores/useStore';
import ProductsContainer from '../components/products/ProductsContainer';

export default function PrivatePage() {
  const { filteredProducts } = useStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-2 ">
      <ProductsContainer products={filteredProducts} />;
    </div>
  );
}
