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
