'use client';
import React, { ChangeEvent, FormEvent } from 'react';

interface FormData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  telefono: string;
  rut: string;
}

interface Props {
  formData: FormData;
  formErrors: Partial<Record<keyof FormData, string>>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}


export default function DatosPersonalesForm({
  formData,
}: Props) {
  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Nombre */}
      <div>
        <label className="block font-medium">
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Primer Apellido */}
      <div>
        <label className="block font-medium">
          Primer apellido <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="primerApellido"
          value={formData.primerApellido}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Segundo Apellido */}
      <div>
        <label className="block font-medium">
          Segundo apellido <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="segundoApellido"
          value={formData.segundoApellido}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium">
          Correo electrónico <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* RUT */}
      <div>
        <label className="block font-medium">
          RUT <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="rut"
          value={formData.rut}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Teléfono */}
      <div className="md:col-span-1">
        <label className="block font-medium">
          Teléfono <span className="text-red-400">*</span>
        </label>
        <div className="flex mt-1">
          <span className="flex items-center px-3 bg-gray-100 rounded-l text-gray-700 text-sm select-none border-r border-r-gray-200">
            +56
          </span>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            disabled
            className="w-full p-2 bg-gray-100 rounded-r text-gray-500"
          />
        </div>
      </div>

      {/* Nota final */}
      <div className="md:col-span-3 mt-6">
        <p className="text-sm text-gray-600 italic">
          Si necesitas actualizar tu información personal, por favor comunícate con el soporte.
        </p>
      </div>
    </form>
  );
}
