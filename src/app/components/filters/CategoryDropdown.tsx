import { CategoryComplexData } from '@/interfaces/category.interface';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '@/hooks/useDropdown';

interface CategoryDropdownProps {
  categories: CategoryComplexData[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  className?: string;
}

export default function CategoryDropdown({
  categories,
  selectedIds,
  onSelectionChange,
  className = '',
}: CategoryDropdownProps) {
  const { isOpen, toggle, ref } = useDropdown();

  const handleCategorySelect = (categoryId: number) => {
    if (selectedIds[0] === categoryId) {
      // Si ya está seleccionada, deselecciona
      onSelectionChange([]);
    } else {
      onSelectionChange([categoryId]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className="bg-gray-100 w-full flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded cursor-pointer"
        onClick={toggle}
      >
        Categoría
        <ChevronDownIcon
          width={20}
          height={20}
          className={`transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    name="category-radio"
                    checked={selectedIds[0] === category.id}
                    onChange={() => handleCategorySelect(category.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
