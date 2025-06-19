'use client';
import React, { useEffect, useState } from 'react';
import { getUserData, ApiUser } from '@/services/actions/user.actions'// Adjust the import path

interface FormData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  telefono: string;
  rut: string;
}

export default function DatosPersonalesForm() {
  const [userData, setUserData] = useState<FormData>({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    telefono: '',
    rut: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const apiUser: ApiUser = await getUserData();
        
        // Transform API data to component format
        // Assuming the name field contains the full name that needs to be split
        const nameParts = apiUser.name.split(' ');
        const nombre = nameParts[0] || '';
        const primerApellido = nameParts[1] || '';
        const segundoApellido = nameParts.slice(2).join(' ') || '';

        setUserData({
          nombre,
          primerApellido,
          segundoApellido,
          email: apiUser.email,
          telefono: apiUser.phone,
          rut: apiUser.rut,
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">Error al cargar los datos: {error}</p>
        <p className="text-sm text-red-500 mt-1">
          Por favor, recarga la página o contacta con soporte.
        </p>
      </div>
    );
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Nombre */}
      <div>
        <label className="block font-medium">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={userData.nombre}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Primer Apellido */}
      <div>
        <label className="block font-medium">
          Primer apellido
        </label>
        <input
          type="text"
          name="primerApellido"
          value={userData.primerApellido}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Segundo Apellido */}
      <div>
        <label className="block font-medium">
          Segundo apellido
        </label>
        <input
          type="text"
          name="segundoApellido"
          value={userData.segundoApellido}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={userData.email}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* RUT */}
      <div>
        <label className="block font-medium">
          RUT
        </label>
        <input
          type="text"
          name="rut"
          value={userData.rut}
          disabled
          className="w-full mt-1 p-2 bg-gray-100 rounded text-gray-500"
        />
      </div>

      {/* Teléfono */}
      <div className="md:col-span-1">
        <label className="block font-medium">
          Teléfono
        </label>
        <div className="flex mt-1">
          <span className="flex items-center px-3 bg-gray-100 rounded-l text-gray-700 text-sm select-none border-r border-r-gray-200">
            +56
          </span>
          <input
            type="text"
            name="telefono"
            value={userData.telefono}
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