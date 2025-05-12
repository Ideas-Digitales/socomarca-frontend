'use client';

import useStore from '@/stores/useStore';

export default function PrivatePage() {
  const { filteredProducts } = useStore();
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex items-center justify-center">
        {filteredProducts.length > 0 && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Productos Disponibles</h1>
            <ul className="mt-4">
              {filteredProducts.map((product) => (
                <li key={product.id} className="mb-2">
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
