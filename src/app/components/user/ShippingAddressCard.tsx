import type { Address } from '@/services/actions/addressees.actions';

export default function ShippingAddressCard({
  address,
  loading,
}: {
  address: Address | null;
  loading: boolean;
}) {
  return (
    <div>
      <label className="block font-medium">Dirección de envío</label>
      {loading ? (
        <p className="text-sm text-gray-500 mt-1">Cargando dirección...</p>
      ) : address ? (
        <div className="w-full p-3 mt-1 rounded bg-[#EBEFF7] text-sm text-gray-800">
          {(address.alias || address.contact_name) && (
            <p className="font-medium">{address.alias || address.contact_name}</p>
          )}
          <p>
            {[address.address_line1, address.address_line2].filter(Boolean).join(', ')}
          </p>
          <p>
            {[address.municipality_name, address.region_name].filter(Boolean).join(', ')}
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-sm mt-1">
          Esta sucursal no tiene una dirección de envío registrada, por lo que no es posible
          pagar. Comunícate con soporte.
        </p>
      )}
    </div>
  );
}
