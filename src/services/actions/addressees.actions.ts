"use server";

import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { BACKEND_URL } from "@/utils/getEnv";

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

    if (!res.ok) {
      console.error("Error al obtener direcciones:", res.statusText);
      return null;
    }

    const json: AddressResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error de red al obtener direcciones:", error);
    return null;
  }
}

export async function updateUserAddress(
  id: number,
  data: Partial<
    Pick<
      Address,
      | "is_default"
      | "alias"
      | "address_line1"
      | "address_line2"
      | "phone"
      | "contact_name"
      | "municipality_name"
      | "region_name"
      | "postal_code"
      | "type"
    >
  >
): Promise<Address | null> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return null;

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

    if (!res.ok) {
      console.error("Error al actualizar dirección:", res.statusText);
      return null;
    }

    const updatedAddress: Address = await res.json();
    return updatedAddress;
  } catch (error) {
    console.error("Error de red al actualizar dirección:", error);
    return null;
  }
}

export async function createUserAddress(
  data: Partial<Address> & { municipality_id: number }
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

    if (!res.ok) {
      console.error("Error al crear dirección:", res.statusText);
      return null;
    }

    const nuevaDireccion: Address = await res.json();
    return nuevaDireccion;
  } catch (error) {
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
): Promise<Address | null> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");

  if (!token) return null;

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

    if (!res.ok) {
      console.error("Error al reemplazar dirección:", await res.text());
      return null;
    }

    const updated: Address = await res.json();
    return updated;
  } catch (err) {
    console.error("Error de red al reemplazar dirección:", err);
    return null;
  }
}

export async function deleteUserAddress(id: number): Promise<boolean> {
  const { getCookie } = await cookiesManagement();
  const authToken = getCookie("token");

  if (!authToken) return false;

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

    if (!res.ok) {
      console.error("Error al eliminar dirección:", res.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error de red al eliminar dirección:", error);
    return false;
  }
}
