import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Define types for our categories
type SubCategory = {
  id: string;
  name: string;
  count?: number;
};

type Category = {
  id: string;
  name: string;
  isOpen?: boolean;
  hasSubCategories?: boolean;
  subCategories?: SubCategory[];
};

// Mock data based on the image
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Despensa',
    isOpen: true,
    hasSubCategories: true,
    subCategories: Array(11)
      .fill(null)
      .map((_, i) => ({
        id: `1-${i}`,
        name: 'XS normal',
      })),
  },
  {
    id: '2',
    name: 'Hogar y limpieza',
    hasSubCategories: true,
  },
  {
    id: '3',
    name: 'Lácteos y fiambre',
    hasSubCategories: true,
  },
  {
    id: '4',
    name: 'Cuidado personal',
    hasSubCategories: true,
  },
  {
    id: '5',
    name: 'Bebestibles',
    hasSubCategories: true,
  },
  {
    id: '6',
    name: 'Confites',
    hasSubCategories: true,
  },
];

// Main component
export default function CategoryFilterDesktop() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(true);

  // Toggle main category section
  const toggleMainCategory = () => {
    setIsMainCategoryOpen(!isMainCategoryOpen);
  };

  // Toggle specific category
  const toggleCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, isOpen: !category.isOpen };
        }
        return category;
      })
    );
  };

  return (
    <div className="flex flex-col items-start bg-white w-[200px]">
      {/* Main category header */}
      <div
        className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer"
        onClick={toggleMainCategory}
      >
        <span className="font-bold uppercase text-gray-800">Categoría</span>
        {isMainCategoryOpen ? (
          <MinusIcon width={24} height={24} color="#84CC16" />
        ) : (
          <PlusIcon width={24} height={24} color="#84CC16" />
        )}
      </div>

      {/* Category list */}
      {isMainCategoryOpen && (
        <div className="w-full">
          {categories.map((category) => (
            <div key={category.id} className="w-full">
              {/* Category header */}
              <div
                className="flex w-full min-h-[40px] p-3 items-center justify-between gap-[10px] cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category.id)}
              >
                <span className="text-sm">{category.name}</span>
                {category.hasSubCategories &&
                  (category.isOpen ? (
                    <ChevronDownIcon width={24} height={24} className="text-lime-500" />
                  ) : (
                    <ChevronRightIcon width={24}height={24} className="text-slate-400" />
                  ))}
              </div>

              {/* Subcategories */}
              {category.isOpen && category.subCategories && (
                <div className="pl-3 pb-2">
                  {category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className="flex items-center py-1 px-3 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      • {subCategory.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MARCAS section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-t border-b border-gray-200 cursor-pointer">
        <span className="font-bold uppercase text-gray-800">Marcas</span>
        <PlusIcon width={24} height={24} color="#84CC16" />
      </div>

      {/* MIS FAVORITOS section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer">
        <span className="font-bold uppercase text-gray-800">Mis favoritos</span>
        <PlusIcon width={24} height={24} color="#84CC16" />
      </div>

      {/* PRECIO section */}
      <div className="flex w-full h-[48px] p-3 items-center justify-between gap-[10px] border-b border-gray-200 cursor-pointer">
        <span className="font-bold uppercase text-gray-800">Precio</span>
        <MinusIcon width={24} height={24} color="#84CC16" />
      </div>

      {/* Price range slider placeholder */}
      <div className="w-full p-3">
        <div className="text-sm mb-2">$500 - 6.850</div>
        <div className="h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-2 bg-lime-500 rounded-full"
            style={{ width: '40%' }}
          ></div>
        </div>

        <div className="flex justify-between gap-2 mb-4">
          <div className="w-1/2">
            <div className="text-xs text-gray-500 mb-1">Desde</div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="$500"
            />
          </div>
          <div className="w-1/2">
            <div className="text-xs text-gray-500 mb-1">Hasta</div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="$9000"
            />
          </div>
        </div>

        <button className="w-full bg-lime-500 text-white rounded-md py-3 px-12 text-center text-[12px]">
          XS medium
        </button>
      </div>
    </div>
  );
}
