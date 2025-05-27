import {
  DashboardTableLayoutProps,
  SortOption,
} from '@/interfaces/dashboard.interface';
import CustomTable from '../admin/CustomTable';
import Search from '../global/Search';
import FilterOptions from './FilterOptions';

interface ExtendedDashboardTableLayoutProps<T>
  extends DashboardTableLayoutProps<T> {
  selectedCategories?: number[];
  selectedSortOptions?: SortOption[];
  onSearch?: (searchTerm: string) => void;
  onClearSearch?: () => void;
}

const DashboardTableLayout = <T extends Record<string, any> = any>({
  config,
  tableData = [],
  tableColumns,
  paginationMeta,
  onPageChange,
  onFilter,
  onCategoryFilter,
  onProviderFilter,
  onSortBy,
  categories,
  selectedCategories = [],
  selectedSortOptions = [],
  onSearch,
  onClearSearch,
}: ExtendedDashboardTableLayoutProps<T>) => {
  const handleSearch = (searchTermValue: string) => {
    console.log('Searching for:', searchTermValue);
    onSearch?.(searchTermValue);
  };

  const handleClearSearch = () => {
    console.log('Search cleared');
    onClearSearch?.();
  };

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col justify-between items-center h-full w-full max-w-7xl px-4 md:px-8">
        <Search
          showLabel={false}
          className="w-full"
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Busca productos ahora"
        />

        <FilterOptions
          onFilter={onFilter}
          onCategoryFilter={onCategoryFilter}
          onProviderFilter={onProviderFilter}
          onSortBy={onSortBy}
          categories={categories}
          selectedCategories={selectedCategories}
          tableColumns={tableColumns}
          selectedSortOptions={selectedSortOptions}
        />
      </div>

      {config.showTable &&
        tableData.length > 0 &&
        paginationMeta &&
        onPageChange && (
          <div className="flex flex-col py-7 px-4 md:px-12 items-center justify-center w-full">
            <CustomTable
              title={config.tableTitle}
              data={tableData}
              columns={tableColumns}
              paginationMeta={paginationMeta}
              onPageChange={onPageChange}
            />
          </div>
        )}
    </div>
  );
};

export default DashboardTableLayout;
