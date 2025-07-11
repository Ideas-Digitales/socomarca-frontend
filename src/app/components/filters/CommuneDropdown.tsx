import { useEffect } from 'react';
import useStore from '@/stores/base';
import Dropdown, { DropdownOption } from './Dropdown';

interface CommuneDropdownProps {
  selectedIds: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
}

export default function CommuneDropdown({
  selectedIds,
  onSelectionChange,
  placeholder = 'Seleccionar comuna',
  className = '',
  multiple = true,
}: CommuneDropdownProps) {
  const { municipalities, isLoadingLocation, fetchRegions } = useStore();

  useEffect(() => {
    // Cargar las regiones y comunas si no están cargadas
    if (municipalities.length === 0 && !isLoadingLocation) {
      fetchRegions();
    }
  }, [municipalities.length, isLoadingLocation, fetchRegions]);

  // Convertir las comunas del store al formato que espera el Dropdown
  const communeOptions: DropdownOption[] = municipalities.map(municipality => ({
    id: municipality.id,
    name: municipality.name
  }));

  return (
    <Dropdown
      options={communeOptions}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      placeholder={isLoadingLocation ? 'Cargando comunas...' : placeholder}
      className={className}
      multiple={multiple}
    />
  );
}
