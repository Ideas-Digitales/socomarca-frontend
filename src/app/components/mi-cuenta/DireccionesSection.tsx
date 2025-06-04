'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { regionesYComunas } from '@/app/components/regionesYComunas';
import { MockAddressProps } from '@/app/(private)/mi-cuenta/page';
import { useState } from 'react';

interface ModalEditarDireccionProps {
  region: string;
  setRegion: (v: string) => void;
  comuna: string;
  setComuna: (v: string) => void;
  onClose: () => void;
  address: MockAddressProps;
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
  const [formData, setFormData] = useState({
    direccion: address.direccion,
    detalle: '',
    telefono: address.telefono,
  });

  const [errors, setErrors] = useState({
    region: '',
    comuna: '',
    direccion: '',
    telefono: '',
  });

  const isAddressFavorite = address.esFavorita;

  const handleFavoriteClick = () => {
    handleSetFavorite(address.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      region: region ? '' : 'Debe seleccionar una región',
      comuna: comuna ? '' : 'Debe seleccionar una comuna',
      direccion: formData.direccion.trim() ? '' : 'La dirección es requerida',
      telefono: /^\d{9}$/.test(formData.telefono)
        ? ''
        : 'Teléfono debe tener 9 dígitos',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí puedes agregar la lógica para guardar los cambios
      console.log('Guardando dirección:', {
        ...formData,
        region,
        comuna,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Editar dirección
        </h2>

        {/* Botón de favorito */}
        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-md">
          {isAddressFavorite ? (
            <HeartIconSolid
              className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
              width={20}
              height={20}
              onClick={handleFavoriteClick}
            />
          ) : (
            <HeartIcon
              className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
              width={20}
              height={20}
              onClick={handleFavoriteClick}
            />
          )}
          <span
            onClick={handleFavoriteClick}
            className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isAddressFavorite
              ? 'Dirección principal'
              : 'Marcar como dirección principal'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Región */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Región <span className="text-red-500">*</span>
            </label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna('');
                if (errors.region) {
                  setErrors((prev) => ({ ...prev, region: '' }));
                }
              }}
              className={`w-full p-3 bg-gray-100 rounded-md border transition-colors outline-none ${
                errors.region
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500'
              }`}
            >
              <option value="">Selecciona una región</option>
              {Object.keys(regionesYComunas).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          {/* Comuna */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Comuna <span className="text-red-500">*</span>
            </label>
            <select
              value={comuna}
              onChange={(e) => {
                setComuna(e.target.value);
                if (errors.comuna) {
                  setErrors((prev) => ({ ...prev, comuna: '' }));
                }
              }}
              className={`w-full p-3 bg-gray-100 rounded-md border transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.comuna
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500'
              }`}
              disabled={!region}
            >
              <option value="">Selecciona una comuna</option>
              {(region ? regionesYComunas[region] : []).map((com) => (
                <option key={com} value={com}>
                  {com}
                </option>
              ))}
            </select>
            {errors.comuna && (
              <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={`w-full p-3 bg-gray-100 rounded-md border transition-colors outline-none ${
                errors.direccion
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500'
              }`}
              placeholder="Ej: Av. Siempre Viva 123"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          {/* Detalle */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Detalle de la dirección
            </label>
            <input
              type="text"
              name="detalle"
              value={formData.detalle}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-colors"
              placeholder="Ej: Departamento 301, Torre A"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`w-full p-3 bg-gray-100 rounded-md border transition-colors outline-none ${
                errors.telefono
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-lime-500 focus:ring-1 focus:ring-lime-500'
              }`}
              placeholder="987654321"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
