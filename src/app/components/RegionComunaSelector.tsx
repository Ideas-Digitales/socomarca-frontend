'use client';
import { useState, useEffect } from 'react';
import { regionesYComunas } from './regionesYComunas';



interface Props {
  region: string;
  comuna: string;
  onChange: (field: 'region' | 'comuna', value: string) => void;
}

export default function RegionComunaSelector({ region, comuna, onChange }: Props) {
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

  useEffect(() => {
    if (region) {
      setComunasDisponibles(regionesYComunas[region] || []);
    } else {
      setComunasDisponibles([]);
    }
  }, [region]);

  return (
  <>
    <div>
      <label className="block font-medium">
        Región <span className="text-red-400">*</span>
      </label>
      <select
        name="region"
        value={region}
        onChange={(e) => onChange('region', e.target.value)}
        className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
      >
        <option value="">Selecciona una región</option>
        {Object.keys(regionesYComunas).map((reg) => (
          <option key={reg} value={reg}>
            {reg}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-medium">
        Comuna <span className="text-red-400">*</span>
      </label>
      <select
        name="comuna"
        value={comuna}
        onChange={(e) => onChange('comuna', e.target.value)}
        className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
        disabled={!region}
      >
        <option value="">Selecciona una comuna</option>
        {comunasDisponibles.map((com) => (
          <option key={com} value={com}>
            {com}
          </option>
        ))}
      </select>
    </div>
  </>
);

}
