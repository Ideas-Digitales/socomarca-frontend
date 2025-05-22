'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import useStore from '@/stores/base';
import { Product } from '@/interfaces/product.interface';
import DualRangeSlider from './DualRangerSlider';

// Main component
export default function CategoryFilterDesktop() {
  const { categories, setFilteredProducts, products } = useStore();
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Price range states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [lowerPrice, setLowerPrice] = useState<number>(0);
  const [upperPrice, setUpperPrice] = useState<number>(0);

  // Reference to track initialization
  const initialized = useRef(false);

  // Format price for display
  const formatPrice = useCallback((price: number): string => {
    return price.toLocaleString('es-CL');
  }, []);

  // Initialize the price range once
  useEffect(() => {
    if (products && products.length > 0 && !initialized.current) {
      // Extract all valid product prices
      const validPrices = products
        .map((product) => product.price || 0)
        .filter((price) => !isNaN(price) && price >= 0);

      if (validPrices.length > 0) {
        // Find min and max prices
        const min = Math.floor(Math.min(...validPrices));
        let max = Math.ceil(Math.max(...validPrices));

        // IMPORTANTE: Si min y max son iguales, solo añadimos un pequeño margen de 1
        // No añadimos 10000 como antes
        if (min === max) {
          max = min + 1;
        }

        console.log('Initial price range:', min, max);

        // Set initial price range
        setMinPrice(min);
        setMaxPrice(max);
        setLowerPrice(min);
        setUpperPrice(max);

        // Mark as initialized
        initialized.current = true;
      }
    }
  }, [products]);

  // Toggle main category section
  const toggleMainCategory = useCallback(() => {
    setIsMainCategoryOpen((prev) => !prev);
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

  // Apply filters (both category and price)
  const applyFilters = useCallback(() => {
    let filteredResults: Product[] = [...products];

    // Apply category filter if one is selected
    if (selectedCategory !== null) {
      filteredResults = filteredResults.filter(
        (product) => product.category_id === selectedCategory
      );
    }

    // Apply price filter
    filteredResults = filteredResults.filter((product) => {
      const price = product.price || 0;
      return price >= lowerPrice && price <= upperPrice;
    });

    setFilteredProducts(filteredResults);
  }, [products, selectedCategory, lowerPrice, upperPrice, setFilteredProducts]);

  const filterProductsByCategory = useCallback(
    (categoryId: number) => {
      // Toggle category selection
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);

        // Apply only price filter
        const filteredByPrice = products.filter((product) => {
          const price = product.price || 0;
          return price >= lowerPrice && price <= upperPrice;
        });

        setFilteredProducts(filteredByPrice);
      } else {
        setSelectedCategory(categoryId);

        // Apply both category and price filters
        const filteredProducts = products.filter(
          (product) =>
            product.category_id === categoryId &&
            (product.price || 0) >= lowerPrice &&
            (product.price || 0) <= upperPrice
        );

        setFilteredProducts(filteredProducts);
      }
    },
    [products, lowerPrice, upperPrice, selectedCategory, setFilteredProducts]
  );

  // Toggle specific category
  // const toggleCategory = useCallback((categoryId: number) => {
  //   setOpenCategories((prev) => {
  //     if (prev.includes(categoryId)) {
  //       return prev.filter((id) => id !== categoryId);
  //     } else {
  //       return [...prev, categoryId];
  //     }
  //   });
  // }, []);

  // Check if min and max are the same value
  const hasPriceRange = minPrice !== maxPrice && initialized.current;

  return (
    <div className="flex flex-col items-start bg-white w-[200px] h-full">
      {/* Main category header */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer"
        onClick={toggleMainCategory}
      >
        <span className="font-bold uppercase text-gray-800">Categoría</span>
        {isMainCategoryOpen ? (
          <MinusIcon width={24} height={24} className="text-lime-500" />
        ) : (
          <PlusIcon width={24} height={24} className="text-lime-500" />
        )}
      </div>

      {/* Category list */}
      {isMainCategoryOpen && (
        <div className="w-full max-h-[40dvh] overflow-y-auto">
          {categories?.map((category) => (
            <div key={category.id} className="w-full">
              {/* Category header */}
              <div
                className={`flex w-full min-h-[40px] p-3 items-center justify-between gap-[10px] cursor-pointer hover:bg-gray-50 ${
                  selectedCategory === category.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => filterProductsByCategory(category.id)}
              >
                <span className="text-sm py-[6px] px-3 text-slate-500">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MARCAS section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-t border-b border-gray-200 cursor-pointer">
        <span className="font-bold uppercase text-gray-800">Marcas</span>
        <PlusIcon width={24} height={24} className="text-lime-500" />
      </div>

      {/* MIS FAVORITOS section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer">
        <span className="font-bold uppercase text-gray-800">Mis favoritos</span>
        <PlusIcon width={24} height={24} className="text-lime-500" />
      </div>

      {/* PRECIO section */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer"
        onClick={togglePriceSection}
      >
        <span className="font-bold uppercase text-gray-800">Precio</span>
        {isPriceOpen ? (
          <MinusIcon width={24} height={24} className="text-lime-500" />
        ) : (
          <PlusIcon width={24} height={24} className="text-lime-500" />
        )}
      </div>

      {/* Price range slider and inputs */}
      {isPriceOpen && initialized.current && (
        <div className="w-full p-3">
          {/* Display current price range */}
          <div className="text-sm mb-3">
            Rango de precios: ${formatPrice(minPrice)}
            {hasPriceRange ? ` - $${formatPrice(maxPrice)}` : ''}
          </div>

          {/* Dual Range Slider Component - only show if there's an actual range and initialization is complete */}
          {hasPriceRange ? (
            <DualRangeSlider
              min={minPrice}
              max={maxPrice}
              initialLower={lowerPrice}
              initialUpper={upperPrice}
              onChange={handlePriceRangeChange}
              formatValue={formatPrice}
              step={100} // Ajustable según necesidades
            />
          ) : (
            <div className="mb-6 mt-4">
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
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder={`$${formatPrice(minPrice)}`}
                value={`$${formatPrice(lowerPrice)}`}
                onChange={handleLowerPriceChange}
                onBlur={() => {
                  // Ensure value is within range on blur
                  if (lowerPrice < minPrice) setLowerPrice(minPrice);
                  if (lowerPrice > upperPrice) setLowerPrice(upperPrice);
                }}
              />
            </div>
            <div className="w-1/2">
              <div className="text-xs text-gray-500 mb-1">Hasta</div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder={`$${formatPrice(maxPrice)}`}
                value={`$${formatPrice(upperPrice)}`}
                onChange={handleUpperPriceChange}
                onBlur={() => {
                  // Ensure value is within range on blur
                  if (upperPrice > maxPrice) setUpperPrice(maxPrice);
                  if (upperPrice < lowerPrice) setUpperPrice(lowerPrice);
                }}
              />
            </div>
          </div>

          <button
            className="w-full bg-lime-500 text-white rounded-md py-3 px-12 text-center text-[12px]"
            onClick={applyFilters}
          >
            Aplicar Filtro
          </button>
        </div>
      )}
    </div>
  );
}
