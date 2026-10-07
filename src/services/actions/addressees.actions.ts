"use server";

import { unstable_rethrow } from "next/navigation";
import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { expireSessionOnUnauthorized } from "@/stores/base/utils/expireSessionOnUnauthorized";
import { BACKEND_URL } from "@/utils/getEnv";
import { Region, Municipality } from "./location.actions";

export interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  is_default: boolean;
  type: "shipping" | "billing" | string;
  phone: string;
  contact_name: string;
  municipality_name: string;
  region_name: string;
  alias: string | null;
  /** La administra la sincronización con Random: no se puede editar ni eliminar */
  is_synced: boolean;
}

export interface ReplaceAddressPayload {
  address_line1: string;
  address_line2: string;
  postal_code: string;
  is_default: boolean;
  type: "shipping" | "billing";
  phone: string;
  contact_name: string;
  municipality_id: number;
  alias: string;
}

/** Campos que el frontend puede enviar: `is_synced` lo define el backend (422 si se envía) */
type MutableAddressFields = Omit<
  Address,
  "id" | "is_synced" | "municipality_name" | "region_name"
>;

/** `forbidden`: la dirección está sincronizada desde Random y el backend respondió 403 */
export type AddressMutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; forbidden: boolean };

interface AddressResponse {
  data: Address[];
}

export async function getUserAddresses(): Promise<Address[] | null> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/addresses/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    await expireSessionOnUnauthorized(res);

    if (!res.ok) {
      console.error("Error al obtener direcciones:", res.statusText);
      return null;
    }

    const json: AddressResponse = await res.json();
    const addresses = json.data;

    // Obtener regiones y municipios con su status para filtrar direcciones válidas
    const regionsRes = await fetch(`${BACKEND_URL}/regions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!regionsRes.ok) {
      console.error("Error al obtener regiones para filtrado:", regionsRes.statusText);
      return addresses; // Retornar todas las direcciones si no se pueden obtener las regiones
    }

    const regions = await regionsRes.json();
    
    // Crear un mapa de regiones válidas (status = true)
    const validRegions = new Set<string>();
    const validMunicipalities = new Set<string>();
    
    regions.forEach((region: Region) => {
      if (region.status === true) {
        validRegions.add(region.name);
        // Agregar municipios válidos de esta región
        if (region.municipalities) {
          region.municipalities.forEach((municipality: Municipality) => {
            if (municipality.status === true) {
              validMunicipalities.add(municipality.name);
            }
          });
        }
      }
    });

    // Filtrar direcciones que tengan región y comuna válidas
    const validAddresses = addresses.filter((address: Address) => {
      const hasValidRegion = validRegions.has(address.region_name);
      const hasValidMunicipality = validMunicipalities.has(address.municipality_name);
      return hasValidRegion && hasValidMunicipality;
    });

    return validAddresses;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error de red al obtener direcciones:", error);
    return null;
  }
}

export async function updateUserAddress(
  id: number,
  data: Partial<
    Pick<
      MutableAddressFields,
      | "is_default"
      | "alias"
      | "address_line1"
      | "address_line2"
      | "phone"
      | "contact_name"
      | "postal_code"
      | "type"
    >
  > &
    Partial<Pick<Address, "municipality_name" | "region_name">>
): Promise<AddressMutationResult<Address>> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return { ok: false, forbidden: false };

  try {
    const res = await fetch(`${BACKEND_URL}/addresses/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    await expireSessionOnUnauthorized(res);

    if (!res.ok) {
      console.error("Error al actualizar dirección:", res.statusText);
      return { ok: false, forbidden: res.status === 403 };
    }

    const updatedAddress: Address = await res.json();
    return { ok: true, data: updatedAddress };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error de red al actualizar dirección:", error);
    return { ok: false, forbidden: false };
  }
}

export async function createUserAddress(
  data: Partial<MutableAddressFields> & {
    municipality_id: number;
    municipality_name?: string;
    region_name?: string;
  }
): Promise<Address | null> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/addresses/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    await expireSessionOnUnauthorized(res);

    if (!res.ok) {
      console.error("Error al crear dirección:", res.statusText);
      return null;
    }

    const nuevaDireccion: Address = await res.json();
    return nuevaDireccion;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error de red al crear dirección:", error);
    return null;
  }
}

export async function updateFullAddress(
  id: number,
  data: {
    address_line1: string;
    address_line2: string;
    postal_code: string;
    is_default: boolean;
    type: "shipping" | "billing";
    phone: string;
    contact_name: string;
    municipality_id: number;
    alias: string;
    region_name: string;
  }
): Promise<Address | null> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");

  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/addresses/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error al actualizar dirección:", await res.text());
      return null;
    }

    const updated: Address = await res.json();
    return updated;
  } catch (err) {
    console.error("Error de red al actualizar dirección:", err);
    return null;
  }
}

export async function replaceUserAddress(
  id: number,
  data: {
    address_line1: string;
    address_line2: string;
    postal_code: string;
    is_default: boolean;
    type: "shipping" | "billing";
    phone: string;
    contact_name: string;
    municipality_id: number;
    alias: string;
    // region_name: string
  }
): Promise<AddressMutationResult<Address>> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");

  if (!token) return { ok: false, forbidden: false };

  console.log("Reemplazando dirección con ID:", id, "y datos:", data);
  try {
    const res = await fetch(`${BACKEND_URL}/addresses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    await expireSessionOnUnauthorized(res);

    if (!res.ok) {
      console.error("Error al reemplazar dirección:", await res.text());
      return { ok: false, forbidden: res.status === 403 };
    }

    const updated: Address = await res.json();
    return { ok: true, data: updated };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error de red al reemplazar dirección:", err);
    return { ok: false, forbidden: false };
  }
}

export async function deleteUserAddress(id: number): Promise<AddressMutationResult<null>> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return { ok: false, forbidden: false };

  try {
    const res = await fetch(`${BACKEND_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    await expireSessionOnUnauthorized(res);

    if (!res.ok) {
      console.error("Error al eliminar dirección:", res.statusText);
      return { ok: false, forbidden: res.status === 403 };
    }

    return { ok: true, data: null };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error de red al eliminar dirección:", error);
    return { ok: false, forbidden: false };
  }
}
