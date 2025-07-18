'use client';

import { useEffect, useState } from 'react';
import { getUserAddresses, Address } from '@/services/actions/addressees.actions';
import Link from 'next/link';

export default function ShippingAddressSelect({
  selectedAddressId,
  onChange,
}: {
  selectedAddressId: number | null;
  onChange: (id: number) => void;
}) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const addresses = await getUserAddresses();
        setAddresses(addresses || []);
        // Si no hay selectedAddressId, selecciona la dirección por defecto
        if ((addresses && addresses.length > 0) && selectedAddressId === null) {
          const defaultAddress = addresses.find(addr => addr.is_default);
          if (defaultAddress) {
            onChange(defaultAddress.id);
          }
        }
      } catch (err) {
        console.error('Error al cargar direcciones de envío', err);
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block font-medium">Seleccionar dirección de envío</label>
        <Link 
          href="/mi-cuenta?section=direcciones" 
          className="text-lime-500 hover:text-lime-600 text-sm underline"
        >
          Editar direcciones
        </Link>
      </div>
      <select
        name="shipping_address"
        value={selectedAddressId ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
        disabled={loading}
      >
        <option value="" disabled>
          {loading ? 'Cargando direcciones...' : 'Seleccione una dirección'}
        </option>
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.alias || 'Sin alias'} - {address.address_line1}, {address.address_line2}
          </option>
        ))}
      </select>
      {addresses.length === 0 && !loading && (
        <div className="mt-2 text-sm text-gray-600">
          No tienes direcciones guardadas.{' '}
          <Link 
            href="/mi-cuenta?section=direcciones" 
            className="text-lime-500 hover:text-lime-600 underline"
          >
            Crear nueva dirección
          </Link>
        </div>
      )}
    </div>
  );
}
