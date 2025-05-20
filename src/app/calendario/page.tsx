"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from 'date-fns/locale';


export default function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
    <div className="relative w-fit" ref={ref}>
      <input
        type="text"
        readOnly
        value={selected ? selected.toLocaleDateString() : ""}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Selecciona una fecha"
        className="border border-slate-200 rounded-lg px-4 py-2 w-52 cursor-pointer bg-slate-50 text-slate-700 shadow-sm hover:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
      />

      {isOpen && (
        <div className="absolute z-50 mt-2 p-2 bg-white border border-slate-200 rounded-lg shadow-lg">
          <DayPicker
          locale={es}
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                setSelected(date);
                setIsOpen(false);
              }
            }}
            modifiersClassNames={{
              selected: "bg-lime-500 text-white",
              today: "text-lime-500 font-bold",
            }}
            classNames={{
              caption: "text-slate-600",
              head_cell: "text-slate-400",
              day: "rounded-full hover:bg-slate-300 focus:outline-none",
              chevron: `fill-lime-500 text-lime-500 hover:fill-lime-600 rounded`,
            }}
          />
        </div>
      )}
    </div>
    </div>
  );
}
