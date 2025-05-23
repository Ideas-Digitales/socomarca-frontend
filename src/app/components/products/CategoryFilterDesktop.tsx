'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import useStore from '@/stores/base';
import { Product } from '@/interfaces/product.interface';
import DualRangeSlider from './DualRangerSlider';

export default function CategoryFilterDesktop() {
  const { categories, setFilteredProducts, products, brands } = useStore();
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [lowerPrice, setLowerPrice] = useState<number>(0);
  const [upperPrice, setUpperPrice] = useState<number>(0);

  const initialized = useRef(false);

  const formatPrice = useCallback((price: number): string => {
    return price.toLocaleString('es-CL');
  }, []);

  useEffect(() => {
    if (products && products.length > 0 && !initialized.current) {
      const validPrices = products
        .map((product) => product.price || 0)
        .filter((price) => !isNaN(price) && price >= 0);

      if (validPrices.length > 0) {
        const min = Math.floor(Math.min(...validPrices));
        let max = Math.ceil(Math.max(...validPrices));

        if (min === max) {
          max = min + 1;
        }

        setMinPrice(min);
        setMaxPrice(max);
        setLowerPrice(min);
        setUpperPrice(max);

        initialized.current = true;
      }
    }
  }, [products]);

  // Toggle main category section
  const toggleMainCategory = useCallback(() => {
    setIsMainCategoryOpen((prev) => !prev);
  }, []);

  // Toggle brands section
  const toggleBrandsSection = useCallback(() => {
    setIsBrandsOpen((prev) => !prev);
  }, []);

  // Toggle price section
  const togglePriceSection = useCallback(() => {
    setIsPriceOpen((prev) => !prev);
  }, []);

  // Handle slider value changes
  const handlePriceRangeChange = useCallback((lower: number, upper: number) => {
    setLowerPrice(lower);
    setUpperPrice(upper);
  }, []);

  // Handle input changes for lower price
  const handleLowerPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove non-numeric characters
      const inputValue = e.target.value.replace(/[^\d]/g, '');

      if (inputValue) {
        const numericValue = parseInt(inputValue);

        if (!isNaN(numericValue)) {
          // Ensure the value is between min and upper price
          const boundedValue = Math.max(
            minPrice,
            Math.min(numericValue, upperPrice)
          );
          setLowerPrice(boundedValue);
        }
      }
    },
    [minPrice, upperPrice]
  );

  // Handle input changes for upper price
  const handleUpperPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove non-numeric characters
      const inputValue = e.target.value.replace(/[^\d]/g, '');

      if (inputValue) {
        const numericValue = parseInt(inputValue);

        if (!isNaN(numericValue)) {
          // Ensure the value is between lower price and max
          const boundedValue = Math.min(
            maxPrice,
            Math.max(numericValue, lowerPrice)
          );
          setUpperPrice(boundedValue);
        }
      }
    },
    [maxPrice, lowerPrice]
  );

  // Toggle individual de categorías
  const toggleCategorySelection = useCallback((categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  }, []);

  // Toggle individual de marcas
  const toggleBrandSelection = useCallback((brandId: number) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  }, []);

  // Apply filters (category, brand, and price)
  const applyFilters = useCallback(() => {
    let filteredResults: Product[] = [...products];

    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter((product) =>
        selectedCategories.includes(product.category.id)
      );
    }

    // Apply brand filter if any brands are selected
    if (selectedBrands.length > 0) {
      filteredResults = filteredResults.filter(
        (product) => product.brand && selectedBrands.includes(product.brand.id)
      );
    }

    // Apply price filter
    filteredResults = filteredResults.filter((product) => {
      const price = product.price || 0;
      return price >= lowerPrice && price <= upperPrice;
    });

    setFilteredProducts(filteredResults);
  }, [
    products,
    selectedCategories,
    selectedBrands,
    lowerPrice,
    upperPrice,
    setFilteredProducts,
  ]);

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setLowerPrice(minPrice);
    setUpperPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Check if min and max are the same value
  const hasPriceRange = minPrice !== maxPrice && initialized.current;

  return (
    <div className="flex flex-col items-start bg-white w-[200px] h-full">
      {/* Main category header */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleMainCategory}
      >
        <span className="font-bold uppercase text-gray-800">Categoría</span>
        <div className="transition-transform duration-300 ease-in-out">
          {isMainCategoryOpen ? (
            <MinusIcon width={24} height={24} className="text-lime-500" />
          ) : (
            <PlusIcon width={24} height={24} className="text-lime-500" />
          )}
        </div>
      </div>

      {/* Category list */}
      <div
        className={`w-full overflow-hidden transition-all duration-400 ease-in-out ${
          isMainCategoryOpen ? 'max-h-[40dvh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-full max-h-[40dvh] overflow-y-auto">
          {categories?.map((category) => (
            <div key={category.id} className="w-full">
              <div
                className={`flex w-full min-h-[40px] items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all duration-300 px-3 py-2 ${
                  selectedCategories.includes(category.id) ? 'bg-gray-100' : ''
                }`}
                onClick={() => toggleCategorySelection(category.id)}
              >
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-300 ease-in-out transform ${
                    selectedCategories.includes(category.id)
                      ? 'bg-lime-500 border-lime-500 scale-110'
                      : 'border-gray-300 scale-100 hover:border-lime-300'
                  }`}
                >
                  <div
                    className={`transition-all duration-200 ${
                      selectedCategories.includes(category.id)
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-75'
                    }`}
                  >
                    {selectedCategories.includes(category.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-500 flex-1 transition-colors duration-200">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MARCAS section */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-t border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleBrandsSection}
      >
        <span className="font-bold uppercase text-gray-800">Marcas</span>
        <div className="transition-transform duration-300 ease-in-out">
          {isBrandsOpen ? (
            <MinusIcon width={24} height={24} className="text-lime-500" />
          ) : (
            <PlusIcon width={24} height={24} className="text-lime-500" />
          )}
        </div>
      </div>

      {/* Brands list */}
      <div
        className={`w-full overflow-hidden transition-all duration-400 ease-in-out ${
          isBrandsOpen ? 'max-h-[40dvh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-full max-h-[40dvh] overflow-y-auto">
          {brands?.map((brand) => (
            <div key={brand.id} className="w-full">
              <div
                className={`flex w-full min-h-[40px] items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all duration-300 px-3 py-2 ${
                  selectedBrands.includes(brand.id) ? 'bg-gray-100' : ''
                }`}
                onClick={() => toggleBrandSelection(brand.id)}
              >
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-300 ease-in-out transform ${
                    selectedBrands.includes(brand.id)
                      ? 'bg-lime-500 border-lime-500 scale-110'
                      : 'border-gray-300 scale-100 hover:border-lime-300'
                  }`}
                >
                  <div
                    className={`transition-all duration-200 ${
                      selectedBrands.includes(brand.id)
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-75'
                    }`}
                  >
                    {selectedBrands.includes(brand.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-500 flex-1 transition-colors duration-200">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIS FAVORITOS section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
        <span className="font-bold uppercase text-gray-800">Mis favoritos</span>
        <div className="transition-transform duration-300 ease-in-out">
          <PlusIcon width={24} height={24} className="text-lime-500" />
        </div>
      </div>

      {/* PRECIO section */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={togglePriceSection}
      >
        <span className="font-bold uppercase text-gray-800">Precio</span>
        <div className="transition-transform duration-300 ease-in-out">
          {isPriceOpen ? (
            <MinusIcon width={24} height={24} className="text-lime-500" />
          ) : (
            <PlusIcon width={24} height={24} className="text-lime-500" />
          )}
        </div>
      </div>

      {/* Price range slider and inputs */}
      <div
        className={`w-full overflow-hidden transition-all duration-400 ease-in-out ${
          isPriceOpen && initialized.current
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-full p-3">
          {hasPriceRange ? (
            <div className="transition-opacity duration-300">
              <DualRangeSlider
                min={minPrice}
                max={maxPrice}
                initialLower={lowerPrice}
                initialUpper={upperPrice}
                onChange={handlePriceRangeChange}
                formatValue={formatPrice}
                step={100}
              />
            </div>
          ) : (
            <div className="mb-6 mt-4 transition-opacity duration-300">
              <div className="text-sm text-center text-gray-500">
                {initialized.current
                  ? 'Todos los productos tienen el mismo precio'
                  : 'Cargando precios...'}
              </div>
              <div className="relative h-2 mb-6 mt-3">
                <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
                <div className="absolute h-2 w-full bg-lime-500 rounded-full"></div>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 mb-4">
            <div className="w-1/2">
              <div className="text-xs text-gray-500 mb-1">Desde</div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 text-sm transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none"
                placeholder={`$${formatPrice(minPrice)}`}
                value={`$${formatPrice(lowerPrice)}`}
                onChange={handleLowerPriceChange}
                onBlur={() => {
                  if (lowerPrice < minPrice) setLowerPrice(minPrice);
                  if (lowerPrice > upperPrice) setLowerPrice(upperPrice);
                }}
              />
            </div>
            <div className="w-1/2">
              <div className="text-xs text-gray-500 mb-1">Hasta</div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 text-sm transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none"
                placeholder={`$${formatPrice(maxPrice)}`}
                value={`$${formatPrice(upperPrice)}`}
                onChange={handleUpperPriceChange}
                onBlur={() => {
                  if (upperPrice > maxPrice) setUpperPrice(maxPrice);
                  if (upperPrice < lowerPrice) setUpperPrice(lowerPrice);
                }}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-lime-500 text-white rounded-md py-3 px-12 text-center text-[12px] hover:bg-lime-600 transition-all duration-300 cursor-pointer"
              onClick={applyFilters}
            >
              Aplicar Filtro
            </button>

            {/* Botón para limpiar filtros */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                lowerPrice !== minPrice ||
                upperPrice !== maxPrice
                  ? 'max-h-12 opacity-100 transform translate-y-0'
                  : 'max-h-0 opacity-0 transform -translate-y-2'
              }`}
            >
              {(selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                lowerPrice !== minPrice ||
                upperPrice !== maxPrice) && (
                <button
                  className="w-full bg-gray-200 text-gray-700 rounded-md py-2 px-12 text-center text-[12px] hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                  onClick={clearAllFilters}
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
