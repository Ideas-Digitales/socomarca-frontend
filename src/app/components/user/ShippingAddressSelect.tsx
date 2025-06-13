'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '@/services/actions/user.actions'; 

interface ShippingAddress {
  id: number;
  address_line1: string;
  address_line2: string;
  contact_name: string;
}

export default function ShippingAddressSelect({
  selectedAddressId,
  onChange,
}: {
  selectedAddressId: number | null;
  onChange: (id: number) => void;
}) {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const user = await getUserData();
        setAddresses(user.shipping_addresses || []);
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
      <label className="block font-medium">Seleccionar dirección de envío</label>
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
            {address.address_line1}, {address.address_line2} ({address.contact_name})
          </option>
        ))}
      </select>
    </div>
  );
}
