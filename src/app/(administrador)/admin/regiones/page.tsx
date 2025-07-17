'use client';

import { useState, useEffect } from 'react';
import { getRegionsWithMunicipalities, Region, Municipality, updateMunicipalitiesStatus, updateRegionStatus } from '@/services/actions/location.actions';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function PanelRegiones() {
  const [filter, setFilter] = useState('');
  const [regions, setRegions] = useState<Region[]>([]); // Tipado correcto
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getRegionsWithMunicipalities();
      setRegions(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleRegion = async (regionId: number) => {
    setSaving(true);
    setSaveMessage(null);
    setRegions((prev) =>
      prev.map((region) =>
        region.id === regionId
          ? {
              ...region,
              status: !region.status,
              municipalities: region.municipalities.map((comuna) => ({
                ...comuna,
                status: !region.status,
              })),
            }
          : region
      )
    );
    const region = regions.find(r => r.id === regionId);
    const newStatus = region ? !region.status : true;
    const ok = await updateRegionStatus(regionId, newStatus);
    setSaving(false);
    if (ok) {
      setSaveMessage('Estado de la región actualizado correctamente.');
    } else {
      setSaveMessage('Error al actualizar estado de la región.');
    }
  };

  const toggleComuna = (regionId: number, comunaId: number) => {
    setRegions((prev) =>
      prev.map((region) =>
        region.id === regionId
          ? {
              ...region,
              municipalities: region.municipalities.map((comuna) =>
                comuna.id === comunaId
                  ? { ...comuna, status: !comuna.status }
                  : comuna
              ),
            }
          : region
      )
    );
  };

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(filter.toLowerCase())
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

      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {filteredRegions.map((region) => (
            <div key={region.id} className="rounded bg-white">
              <button
                onClick={() => setExpanded(expanded === region.id ? null : region.id)}
                className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              >
                <span>{region.name}</span>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={region.status}
                    onChange={() => toggleRegion(region.id)}
                    className="w-5 h-5"
                  />
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${expanded === region.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {expanded === region.id && (
                <div className="px-6 pb-4">
                  <ul className="space-y-2 mt-2">
                    {region.municipalities.map((comuna) => (
                      <li key={comuna.id} className="flex justify-between items-center">
                        <span>{comuna.name}</span>
                        <input
                          type="checkbox"
                          checked={comuna.status}
                          onChange={() => toggleComuna(region.id, comuna.id)}
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
      )}

      <div className="mt-6 flex flex-col items-end">
        <button
          className="bg-[#87c814] text-white px-6 py-2 rounded hover:bg-[#76b40e] transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setSaveMessage(null);
            const allMunicipalities = regions.flatMap(r => r.municipalities);
            const activeIds = allMunicipalities.filter(c => c.status).map(c => c.id);
            const inactiveIds = allMunicipalities.filter(c => !c.status).map(c => c.id);
            let ok = true;
            if (activeIds.length > 0) {
              ok = (await updateMunicipalitiesStatus(activeIds, true)) && ok;
            }
            if (inactiveIds.length > 0) {
              ok = (await updateMunicipalitiesStatus(inactiveIds, false)) && ok;
            }
            setSaving(false);
            if (ok) {
              setSaveMessage('Cambios guardados correctamente.');
            } else {
              setSaveMessage('Error al guardar cambios.');
            }
          }}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {saving && (
          <span className="mt-2 text-gray-500 text-sm">Guardando cambios...</span>
        )}
        {saveMessage && !saving && (
          <span className={`mt-2 text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{saveMessage}</span>
        )}
      </div>
    </div>
  );
}
