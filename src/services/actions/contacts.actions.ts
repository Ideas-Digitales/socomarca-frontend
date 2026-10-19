"use server";

import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { expireSessionOnUnauthorized } from "@/stores/base/utils/expireSessionOnUnauthorized";
import { BACKEND_URL } from "@/utils/getEnv";

export interface Contact {
  id: number;
  entity_code: string;
  rut: string;
  name: string;
  email: string | null;
  phone: string | null;
  fax: string | null;
  position: string | null;
  area: string | null;
  user_id: number;
  branch: {
    id: number;
    name: string;
    branch_code: string | null;
    branch_type: string | null;
  } | null;
  authorized: boolean;
  address: string | null;
}

export interface ContactPayload {
  rut: string;
  name: string;
  email: string;
  phone: string;
  /** Solo lo envía la sucursal principal cuando elige sucursal. */
  user_id?: number;
  authorized: boolean;
  address: string;
}

export interface ContactWriteResult {
  ok: boolean;
  status: number;
  contact?: Contact;
  message?: string;
  errors?: Record<string, string[]>;
}

async function authHeaders(): Promise<HeadersInit | null> {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function getContacts(): Promise<Contact[] | null> {
  const headers = await authHeaders();
  if (!headers) return null;

  const res = await fetch(`${BACKEND_URL}/contacts`, {
    headers,
    cache: "no-store",
  });

  await expireSessionOnUnauthorized(res);

  if (!res.ok) return null;

  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

async function writeContact(
  url: string,
  method: "POST" | "PUT",
  payload: ContactPayload,
): Promise<ContactWriteResult> {
  const headers = await authHeaders();
  if (!headers) {
    return { ok: false, status: 401, message: "Token no disponible" };
  }

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload),
  });

  await expireSessionOnUnauthorized(res);

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: json?.message ?? "No se pudo guardar el contacto.",
      errors: json?.errors,
    };
  }

  return { ok: true, status: res.status, contact: json.data };
}

export async function createContact(payload: ContactPayload): Promise<ContactWriteResult> {
  return writeContact(`${BACKEND_URL}/contacts`, "POST", payload);
}

export async function updateContact(
  id: number,
  payload: ContactPayload,
): Promise<ContactWriteResult> {
  return writeContact(`${BACKEND_URL}/contacts/${id}`, "PUT", payload);
}
