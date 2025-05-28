import { Category } from '@/interfaces/category.interface';
import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SortDropdown from '../filters/SortDropdown';
import { Comuna } from '@/mock/comunasVentas';
import Dropdown, { DropdownOption } from '../filters/Dropdown';
import { Client } from '@/app/(administrador)/admin/total-de-ventas/page';
import AmountFilter from '../filters/AmountFilter';

interface Props {
  onFilter?: () => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onProviderFilter?: () => void;
  onSortBy?: (option: SortOption | null) => void;
  categories?: Category[];
  selectedCategories?: number[];
  tableColumns?: TableColumn<any>[];
  selectedSortOption?: SortOption | null;
  onCommuneFilter?: (selectedIds: string[]) => void;
  selectedCommunes?: string[];
  communes?: Comuna[];
  onAmountFilter?: (amount: string) => void;
  amountValue?: string;
  clients?: Client[];
  onClientFilter?: (clientId: number) => void;
  selectedClients?: Client[];
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
  onCommuneFilter,
  selectedCommunes = [],
  communes = [],
  onAmountFilter,
  amountValue = '',
  clients = [],
  onClientFilter,
  selectedClients = [],
}: Props) {
  // Convertir categorías a DropdownOption
  const categoryOptions: DropdownOption[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  // Convertir comunas a DropdownOption
  const communeOptions: DropdownOption[] = communes.map((commune) => ({
    id: commune.comuna,
    name: commune.comuna,
  }));

  // Convertir clientes a DropdownOption
  const clientOptions: DropdownOption[] = clients.map((client) => ({
    id: client.id,
    name: client.name,
  }));

  const handleCategoryChange = (selectedIds: (string | number)[]) => {
    const numericIds = selectedIds.map((id) => Number(id));
    onCategoryFilter?.(numericIds);
  };

  const handleCommuneChange = (selectedIds: (string | number)[]) => {
    const stringIds = selectedIds.map((id) => String(id));
    onCommuneFilter?.(stringIds);
  };

  const handleClientChange = (selectedIds: (string | number)[]) => {
    const numericIds = selectedIds.map((id) => Number(id));
    onClientFilter?.(numericIds[0]); // Solo toma el primero ya que es selección única
  };

  return (
    <div className="w-full justify-end flex px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 flex-1-0-0 flex-col md:flex-row w-full">
          {onAmountFilter && (
            <AmountFilter
              value={amountValue}
              onChange={onAmountFilter}
              className="w-full md:max-w-[216px] md:w-full"
            />
          )}

          {onClientFilter && (
            <Dropdown
              options={clientOptions}
              selectedIds={selectedClients.map((client) => client.id)}
              onSelectionChange={handleClientChange}
              placeholder="Cliente"
              className="w-full md:max-w-[216px] md:w-full"
              multiple={false} // Solo un cliente
            />
          )}

          {onCategoryFilter && (
            <Dropdown
              options={categoryOptions}
              selectedIds={selectedCategories}
              onSelectionChange={handleCategoryChange}
              placeholder="Categoría"
              className="w-full md:max-w-[120px] md:w-full"
              multiple={true} // Múltiples categorías
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

          {onCommuneFilter && (
            <Dropdown
              options={communeOptions}
              selectedIds={selectedCommunes}
              onSelectionChange={handleCommuneChange}
              placeholder="Comuna"
              className="w-full md:max-w-[120px] md:w-full"
              multiple={true} // Múltiples comunas
            />
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
