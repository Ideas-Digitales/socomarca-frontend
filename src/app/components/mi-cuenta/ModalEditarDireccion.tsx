'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { regionesYComunas } from '@/app/components/regionesYComunas';
import { MockAddressProps } from '@/app/(private)/mi-cuenta/page';

interface ModalEditarDireccionProps {
  region: string;
  setRegion: (v: string) => void;
  comuna: string;
  setComuna: (v: string) => void;
  onClose: () => void;
  address: MockAddressProps | null;
  handleSetFavorite: (addressId: number) => void;
}

export default function ModalEditarDireccion({
  region,
  setRegion,
  comuna,
  setComuna,
  onClose,
  address,
  handleSetFavorite,
}: ModalEditarDireccionProps) {
  // Validación de que address existe
  if (!address) {
    return null;
  }

  const isAddressFavorite = address.esFavorita;

  const handleFavoriteClick = () => {
    handleSetFavorite(address.id);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl w-full relative mx-4">
        <h2 className="text-xl font-bold mb-4">Editar dirección</h2>

        <div className="text-slate-600 font-medium text-sm cursor-pointer flex items-center gap-2 mb-4">
          {isAddressFavorite ? (
            <HeartIconSolid
              className="cursor-pointer text-red-500"
              width={16}
              height={16}
              onClick={handleFavoriteClick}
            />
          ) : (
            <HeartIcon
              className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
              width={16}
              height={16}
              onClick={handleFavoriteClick}
            />
          )}
          <span
            onClick={handleFavoriteClick}
            className="cursor-pointer hover:text-slate-800 transition-colors"
          >
            {isAddressFavorite
              ? 'Dirección principal'
              : 'Marcar como dirección principal'}
          </span>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            // Aquí puedes agregar la lógica para guardar los cambios
            console.log('Guardando dirección:', { region, comuna });
            onClose();
          }}
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Región<span className="text-red-500">*</span>
            </label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna('');
              }}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors"
              required
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
                Debe seleccionar una región.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Comuna<span className="text-red-500">*</span>
            </label>
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!region}
              required
            >
              <option value="">Selecciona una comuna</option>
              {(region ? regionesYComunas[region] : []).map((com) => (
                <option key={com} value={com}>
                  {com}
                </option>
              ))}
            </select>
            {region && comuna === '' && (
              <p className="text-red-500 text-sm mt-1">
                Debe seleccionar una comuna.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Dirección<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={address.direccion}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors"
              placeholder="Ej: Av. Siempre Viva 123"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Detalle de la dirección
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors"
              placeholder="Ej: Departamento 301, Torre A"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Teléfono<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              defaultValue={address.telefono}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors"
              placeholder="987654321"
              pattern="[0-9]{9}"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
