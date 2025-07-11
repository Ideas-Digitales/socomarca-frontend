import { Category } from '@/interfaces/category.interface';
import { SortOption, TableColumn } from '@/interfaces/dashboard.interface';
import SortDropdown from '../filters/SortDropdown';
import Dropdown, { DropdownOption } from '../filters/Dropdown';
import { Client } from '@/app/(administrador)/admin/total-de-ventas/page';
import AmountFilter from '../filters/AmountFilter';
import SearchableDropdown, {
  SearchableOption,
} from '../filters/SearchableDropdown';
import { Customer } from '@/services/actions/clients.actions';

interface AmountRange {
  min: string;
  max: string;
}

interface Props {
  onFilter?: () => void;
  onCategoryFilter?: (selectedIds: number[]) => void;
  onProviderFilter?: () => void;
  onSortBy?: (option: SortOption | null) => void;
  categories?: Category[];
  selectedCategories?: number[];
  tableColumns?: TableColumn<any>[];
  selectedSortOption?: SortOption | null;
  onCommuneFilter?: (selectedIds: (string | number)[]) => void;
  selectedCommunes?: (string | number)[];
  onAmountFilter?: (amount: AmountRange) => void;
  amountValue?: AmountRange;
  clients?: Client[];
  customers?: Customer[];
  onClientFilter?: (clientId: number) => void;
  selectedClients?: Client[];
  searchableDropdown?: boolean;
  communes?: any[];
}

export default function FilterOptions({
  onFilter,
  onCategoryFilter,
  onSortBy,
  categories = [],
  selectedCategories = [],
  tableColumns = [],
  selectedSortOption = null,
  onCommuneFilter,
  selectedCommunes = [],
  onAmountFilter,
  amountValue = { min: '', max: '' },
  clients = [],
  customers = [],
  onClientFilter,
  selectedClients = [],
  searchableDropdown = false,
  communes = [],
}: Props) {
  // Convertir categorías a DropdownOption
  const categoryOptions: DropdownOption[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  // Convertir clientes a DropdownOption (para Dropdown normal)
  const clientOptions: DropdownOption[] = clients.map((client) => ({
    id: client.id,
    name: client.name,
  }));

  // Convertir customers a SearchableOption (para SearchableDropdown)
  const searchableCustomerOptions: SearchableOption[] = customers.map((customer) => ({
    id: customer.id,
    name: customer.customer,
  }));

  const handleCategoryChange = (selectedIds: (string | number)[]) => {
    const numericIds = selectedIds.map((id) => Number(id));
    onCategoryFilter?.(numericIds);
  };

  // Handler para Dropdown normal de clientes
  const handleClientChange = (selectedIds: (string | number)[]) => {
    const numericIds = selectedIds.map((id) => Number(id));
    onClientFilter?.(numericIds[0]); // Solo toma el primero ya que es selección única
  };

  // Handler para SearchableDropdown de customers
  const handleSearchableCustomerChange = (option: SearchableOption | null) => {
    if (option) {
      onClientFilter?.(option.id as number);
    } else {
      // Limpiar selección - usar un valor que indique "sin selección"
      onClientFilter?.(-1); // Cambiar a -1 para indicar limpieza
    }
  };

  // Obtener el customer seleccionado para SearchableDropdown
  const getSelectedCustomer = (): SearchableOption | null => {
    if (selectedClients.length > 0) {
      const selected = selectedClients[0];
      return { id: selected.id, name: selected.name };
    }
    return null;
  };

  return (
    <div className="w-full justify-end flex">
      <div className="flex flex-col md:flex-row items-center gap-3 w-full px-4">
        <div className="flex items-center gap-3 flex-1-0-0 flex-col md:flex-row w-full">
          {onAmountFilter && (
            <AmountFilter
              value={amountValue}
              onChange={onAmountFilter}
              className="w-full md:max-w-[216px] md:w-full"
            />
          )}

          {onClientFilter && (
            (!searchableDropdown ? (
              <Dropdown
                options={clientOptions}
                selectedIds={selectedClients.map((client) => client.id)}
                onSelectionChange={handleClientChange}
                placeholder="Cliente"
                className="w-full md:max-w-[216px] md:w-full"
                multiple={false}
              />
            ) : (
              <SearchableDropdown
                options={searchableCustomerOptions}
                selectedOption={getSelectedCustomer()}
                onSelectionChange={handleSearchableCustomerChange}
                placeholder="Buscar cliente"
                noResultsText="No se encontró el cliente"
                className="w-full md:max-w-[216px] md:w-full"
              />
            ))
          )}

          {onCategoryFilter && (
            <Dropdown
              options={categoryOptions}
              selectedIds={selectedCategories}
              onSelectionChange={handleCategoryChange}
              placeholder="Categoría"
              className="w-full md:max-w-[120px] md:w-full"
              multiple={true}
            />
          )}

          {onCommuneFilter && (
            <Dropdown
              options={communes}
              selectedIds={selectedCommunes}
              onSelectionChange={onCommuneFilter}
              placeholder="Comuna"
              className="w-full md:max-w-[120px] md:w-full"
              multiple={false}
            />
          )}

          {onCommuneFilter && (
            <Dropdown
              options={communes}
              selectedIds={selectedCommunes}
              onSelectionChange={onCommuneFilter}
              placeholder="Comuna"
              className="w-full md:max-w-[120px] md:w-full"
              multiple={false}
            />
          )}

          {/* onProviderFilter && (
            <button
              className="w-full md:max-w-[216px] md:w-full bg-gray-100 flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded"
              onClick={onProviderFilter}
            >
              Distribuidor/Proveedor
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
          ) */}



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
            className="w-full cursor-pointer md:max-w-[120px] md:w-full py-3 px-8 border-slate-400 rounded-[6px] h-10 border flex items-center justify-center text-gray-500 text-xs font-medium"
            onClick={onFilter}
          >
            Filtrar
          </button>
        )}
      </div>
    </div>
  );
}
