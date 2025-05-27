import { Category } from '@/interfaces/category.interface';
import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CategoryDropdown from '../filters/CategoryDropdown';
import SortDropdown from '../filters/SortDropdown';

interface Props {
  onFilter?: () => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onProviderFilter?: () => void;
  onSortBy?: (option: SortOption | null) => void;
  categories: Category[];
  selectedCategories?: number[];
  tableColumns?: TableColumn<any>[];
  selectedSortOption?: SortOption | null;
}

export default function FilterOptions({
  onFilter,
  onCategoryFilter,
  onProviderFilter,
  onSortBy,
  categories = [],
  selectedCategories = [],
  tableColumns = [],
  selectedSortOption = null,
}: Props) {
  return (
    <div className="w-full justify-end flex px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 flex-1-0-0 flex-col md:flex-row w-full">
          {onCategoryFilter && (
            <CategoryDropdown
              categories={categories}
              selectedIds={selectedCategories}
              onSelectionChange={onCategoryFilter}
              className="w-full md:max-w-[120px] md:w-full"
            />
          )}

          {onProviderFilter && (
            <button
              className="w-full md:max-w-[216px] md:w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded"
              onClick={onProviderFilter}
            >
              Distribuidor/Proveedor
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
          )}

          {onSortBy && tableColumns && tableColumns.length > 0 && (
            <SortDropdown
              tableColumns={tableColumns}
              selectedOption={selectedSortOption}
              onSelectionChange={onSortBy}
              className="w-full md:max-w-[134px] md:w-full"
            />
          )}
        </div>

        {onFilter && (
          <button
            className="w-full md:max-w-[120px] md:w-full py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium"
            onClick={onFilter}
          >
            Filtrar
          </button>
        )}
      </div>
    </div>
  );
}
