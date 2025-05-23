'use client';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { es } from 'date-fns/locale';
import { useState } from 'react';

export default function DayPickerComponent() {
  const [selected, setSelected] = useState<Date>();
  return (
    <div className="rounded-[2px] border-[1px] border-solid border-slate-200 p-3">
      <DayPicker
        locale={es}
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (date) {
            setSelected(date);
          }
        }}
        className='mb-3'
        modifiersClassNames={{
          selected: 'bg-lime-500 text-white',
          today: 'text-lime-500 font-bold',
        }}
        classNames={{
          caption: 'text-slate-600',
          head_cell: 'text-slate-400',
          day: 'rounded-full hover:bg-slate-300 focus:outline-none',
          chevron: `fill-lime-500 text-lime-500 hover:fill-lime-600 rounded`,
        }}
      />
      <span className="text-sm">Selecciona una fecha</span>
    </div>
  );
}
