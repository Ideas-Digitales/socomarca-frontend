'use client';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';

interface DayPickerComponentProps {
  onDateRangeChange?: (start: string, end: string) => void;
  initialDateRange?: {
    start?: string;
    end?: string;
  };
}

export default function DayPickerComponent({ 
  onDateRangeChange,
  initialDateRange 
}: DayPickerComponentProps = {}) {
  const [selected, setSelected] = useState<DateRange | undefined>();

  // Inicializar con el rango de fechas proporcionado
  useEffect(() => {
    if (initialDateRange?.start || initialDateRange?.end) {
      const from = initialDateRange.start ? startOfDay(parseISO(initialDateRange.start)) : undefined;
      const to = initialDateRange.end ? startOfDay(parseISO(initialDateRange.end)) : undefined;
      setSelected({ from, to });
    }
  }, [initialDateRange]);

  // Manejar cambios en la selección de fechas
  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    
    if (range?.from && range?.to && onDateRangeChange) {
      const startDate = format(startOfDay(range.from), 'yyyy-MM-dd');
      const endDate = format(startOfDay(range.to), 'yyyy-MM-dd');
      onDateRangeChange(startDate, endDate);
    } else if (range?.from && !range?.to && onDateRangeChange) {
      // Si solo hay fecha de inicio, usar la misma para inicio y fin
      const startDate = format(startOfDay(range.from), 'yyyy-MM-dd');
      onDateRangeChange(startDate, startDate);
    }
  };

  // Función para formatear el rango de fechas seleccionado
  const getSelectedText = () => {
    if (!selected) {
      return 'Selecciona un rango de fechas';
    }

    const { from, to } = selected;

    if (from && to) {
      return `${format(startOfDay(from), 'dd/MM/yyyy')} - ${format(startOfDay(to), 'dd/MM/yyyy')}`;
    } else if (from) {
      return `Desde: ${format(startOfDay(from), 'dd/MM/yyyy')}`;
    }

    return 'Selecciona un rango de fechas';
  };

  return (
    <div className="rounded-[2px] border-[1px] border-solid border-slate-200 p-3">
      <DayPicker
        locale={es}
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        className="mb-3"
        modifiersClassNames={{
          selected: 'bg-lime-500 text-white',
          range_start: 'bg-lime-500 text-white rounded-full rounded-r-none',
          range_end: 'bg-lime-500 text-white rounded-full rounded-l-none',
          today: 'text-lime-500 font-bold',
        }}
        classNames={{
          caption: 'text-slate-600',
          head_cell: 'text-slate-400',
          day: 'hover:bg-slate-300 focus:outline-none',
          chevron: 'fill-lime-500 text-lime-500 hover:fill-lime-600 rounded',
        }}
      />
      <span className="text-sm">{getSelectedText()}</span>
    </div>
  );
}
