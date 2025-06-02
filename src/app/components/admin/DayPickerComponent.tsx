'use client';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { format } from 'date-fns';

export default function DayPickerComponent() {
  const [selected, setSelected] = useState<DateRange | undefined>();

  // Función para formatear el rango de fechas seleccionado
  const getSelectedText = () => {
    if (!selected) {
      return 'Selecciona un rango de fechas';
    }

    const { from, to } = selected;

    if (from && to) {
      return `${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`;
    } else if (from) {
      return `Desde: ${format(from, 'dd/MM/yyyy')}`;
    }

    return 'Selecciona un rango de fechas';
  };

  return (
    <div className="rounded-[2px] border-[1px] border-solid border-slate-200 p-3">
      <DayPicker
        locale={es}
        mode="range"
        selected={selected}
        onSelect={setSelected}
        className="mb-3"
        modifiersClassNames={{
          selected: 'bg-lime-500 text-white',
          range_start: 'bg-lime-500 text-white',
          range_end: 'bg-lime-500 text-white',
          range_middle: 'bg-lime-200 text-lime-800',
          today: 'text-lime-500 font-bold',
        }}
        classNames={{
          caption: 'text-slate-600',
          head_cell: 'text-slate-400',
          day: 'rounded-full hover:bg-slate-300 focus:outline-none',
          chevron: 'fill-lime-500 text-lime-500 hover:fill-lime-600 rounded',
        }}
      />
      <span className="text-sm">{getSelectedText()}</span>
    </div>
  );
}
