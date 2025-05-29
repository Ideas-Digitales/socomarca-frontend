import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '@/hooks/useDropdown';

export interface DropdownOption {
  id: string | number;
  name: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedIds: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  placeholder: string;
  className?: string;
  multiple?: boolean;
}

export default function Dropdown({
  options,
  selectedIds,
  onSelectionChange,
  placeholder,
  className = '',
  multiple = true,
}: DropdownProps) {
  const { isOpen, toggle, ref } = useDropdown();

  const handleToggle = (optionId: string | number) => {
    if (multiple) {
      // Comportamiento original: múltiple selección
      const newSelectedIds = selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId];
      onSelectionChange(newSelectedIds);
    } else {
      // Selección única: solo un elemento
      onSelectionChange([optionId]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className="bg-gray-100 w-full flex justify-between items-center p-[10px] h-10 text-gray-500 text-md rounded cursor-pointer"
        onClick={toggle}
      >
        {placeholder}
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
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type={multiple ? 'checkbox' : 'radio'}
                    name={multiple ? undefined : 'dropdown-option'}
                    checked={selectedIds.includes(option.id)}
                    onChange={() => handleToggle(option.id)}
                    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 ${
                      multiple ? 'rounded' : 'rounded-full'
                    }`}
                  />
                  <span className="text-sm text-gray-700">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
