'use client';

import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { regionesYComunas } from '@/app/components/regionesYComunas';

export default function ModalEditarDireccion({
  region,
  setRegion,
  comuna,
  setComuna,
  onClose,
}: {
  region: string;
  setRegion: (v: string) => void;
  comuna: string;
  setComuna: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl w-full relative">
        <h2 className="text-xl font-bold mb-4">Editar dirección</h2>

        <div className="absolute right-6 top-6 text-green-600 font-medium text-sm cursor-pointer flex items-center gap-1">
          <HeartOutline className="w-4 h-4" />
          <span>Marcar como dirección principal</span>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            // Validar y guardar dirección aquí si se desea
            onClose();
          }}
        >
          <div>
            <label className="block font-medium">
              Región<span className="text-red-500">*</span>
            </label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna('');
              }}
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
            >
              <option value="">Selecciona una región</option>
              {Object.keys(regionesYComunas).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {region === '' && (
              <p className="text-red-500 text-sm mt-1">
                No ha seleccionado una región.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">
              Comuna<span className="text-red-500">*</span>
            </label>
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
              disabled={!region}
            >
              <option value="">Selecciona una comuna</option>
              {(region ? regionesYComunas[region] : []).map((com) => (
                <option key={com} value={com}>
                  {com}
                </option>
              ))}
            </select>

            {comuna === '' && (
              <p className="text-red-500 text-sm mt-1">
                No ha seleccionado una comuna.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">
              Dirección<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Detalle de la dirección</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
            />
          </div>

          <div className="col-span-2 flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
