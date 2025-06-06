'use client';

import { useState } from 'react';
import { regionesYComunas } from '@/app/components/regionesYComunas';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function PanelRegiones() {
  const [filter, setFilter] = useState('');
  const [regionesActivas, setRegionesActivas] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(regionesYComunas).map((r) => [r, true]))
  );
  const [comunasActivas, setComunasActivas] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(
      Object.entries(regionesYComunas).map(([region, comunas]) => [
        region,
        Object.fromEntries(comunas.map((comuna) => [comuna, true])),
      ])
    )
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleRegion = (region: string) => {
    const newState = !regionesActivas[region];
    setRegionesActivas((prev) => ({ ...prev, [region]: newState }));
    setComunasActivas((prev) => ({
      ...prev,
      [region]: Object.fromEntries(
        Object.keys(prev[region]).map((c) => [c, newState])
      ),
    }));
  };

  const toggleComuna = (region: string, comuna: string) => {
    setComunasActivas((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        [comuna]: !prev[region][comuna],
      },
    }));
  };

  const filteredRegiones = Object.keys(regionesYComunas).filter((region) =>
    region.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-[#f5f9fc] p-6 rounded-md max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Regiones y comunas activas</h2>

      <input
        type="text"
        placeholder="Buscar región..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 w-full px-4 py-2 rounded border border-gray-300"
      />

      <div className="space-y-3">
        {filteredRegiones.map((region) => (
          <div key={region} className="rounded bg-white">
            <button
              onClick={() => setExpanded(expanded === region ? null : region)}
              className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100"
            >
              <span>{region}</span>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={regionesActivas[region]}
                  onChange={() => toggleRegion(region)}
                  className="w-5 h-5"
                />
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    expanded === region ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {expanded === region && (
              <div className="px-6 pb-4">
                <ul className="space-y-2 mt-2">
                  {regionesYComunas[region].map((comuna) => (
                    <li key={comuna} className="flex justify-between items-center">
                      <span>{comuna}</span>
                      <input
                        type="checkbox"
                        checked={comunasActivas[region][comuna]}
                        onChange={() => toggleComuna(region, comuna)}
                        className="w-5 h-5"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-[#87c814] text-white px-6 py-2 rounded hover:bg-[#76b40e] transition">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
