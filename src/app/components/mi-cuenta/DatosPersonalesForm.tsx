'use client';
import React from 'react';
import TelefonoInput from '../global/TelefonoInput';

export default function DatosPersonalesForm({
  formData,
  formErrors,
  onChange,
  onSubmit,
  setFormData,
}: {
  formData: any;
  formErrors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {[
        { label: 'Nombre', name: 'nombre' },
        { label: 'Primer apellido', name: 'primerApellido' },
        { label: 'Segundo apellido', name: 'segundoApellido' },
        { label: 'Correo electrónico', name: 'email', type: 'email' },
        { label: 'RUT', name: 'rut' },
      ].map(({ label, name, type = 'text' }) => (
        <div key={name}>
          <label className="block font-medium">{label}<span className="text-red-400">*</span></label>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={onChange}
            className={`w-full mt-1 p-2 bg-gray-100 rounded ${
              formErrors[name] && 'border border-red-500'
            }`}
          />
          {formErrors[name] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[name]}</p>
          )}
        </div>
      ))}

      {/* Teléfono con prefijo */}
      <div className="md:col-span-1">
        <TelefonoInput
          name="telefono"
          value={formData.telefono}
          onChange={(e, prefijo) =>
            setFormData((prev: any) => ({
              ...prev,
              telefono: e.target.value,
              telefonoCompleto: `${prefijo}${e.target.value}`,
            }))
          }
          error={formErrors.telefono}
        />
      </div>

      <div className="md:col-span-3 mt-4">
        <button
          type="submit"
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
