"use server";

import { unstable_rethrow } from "next/navigation";
import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { expireSessionOnUnauthorized } from "@/stores/base/utils/expireSessionOnUnauthorized";
import { BACKEND_URL } from "@/utils/getEnv";
import {
  buildCancelOrderBody,
  parseCancelOrderResponse,
  type CancelOrderResult,
} from "@/utils/cancelOrder";

import type { OrderResponse } from "@/interfaces/order.interface";
import { payOrderBody } from "@/utils/contact";

export async function createOrderFromCart({
  shippingAddressId,
  paymentMethod,
  customerId,
  paymentDocumentType,
  notes,
  contactId,
}: {
  shippingAddressId: number;
  paymentMethod: string;
  /** Sucursal para la que se compra; se omite cuando el usuario compra para sí mismo */
  customerId?: number;
  paymentDocumentType: 'invoice' | 'receipt';
  notes?: string;
  /** Contacto de la entidad. Se omite cuando la compra no lleva contacto. */
  contactId?: number | null;
}) {
  const { getCookie } = await cookiesManagement();
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token no disponible");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body = payOrderBody({
    shippingAddressId,
    paymentMethod,
    customerId,
    paymentDocumentType,
    notes,
    contactId,
  });

  const res = await fetch(`${BACKEND_URL}/orders/pay`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  await expireSessionOnUnauthorized(res);

  const json = await res.json();
  console.log('[orders/pay] Respuesta cruda:', JSON.stringify(json, null, 2));

  return {
    ok: res.ok && json?.success !== false,
    status: res.status,
    body: json,
  };
}

/**
 * Cancela una orden en espera de factura (FCV).
 * El texto de error es el que devuelve la API.
 */
export async function cancelOrder(orderNumber: string): Promise<CancelOrderResult> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie("token");

    if (!token) {
      return { ok: false, status: 401, message: "Unauthorized: No token found" };
    }

    const res = await fetch(`${BACKEND_URL}/orders/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildCancelOrderBody(orderNumber)),
    });

    await expireSessionOnUnauthorized(res);

    const raw = await res.text();
    let body: unknown = null;

    if (raw.trim() !== "") {
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }
    }

    return parseCancelOrderResponse(res.status, body);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error al cancelar la orden:", error);
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}


export async function getUserOrders(
  page = 1,
  per_page = 20,
  sort: string = 'created_at',
  sort_direction: 'asc' | 'desc' = 'desc',
  payment_method_code?: string,
): Promise<OrderResponse | null> {

 const { getCookie } = await cookiesManagement();
  const token = getCookie("token");
  if (!token) return null

  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
      sort,
      sort_direction,
      ...(payment_method_code ? { payment_method_code } : {}),
    });
    const res = await fetch(`${BACKEND_URL}/orders?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('Error al obtener órdenes:', res.statusText)
      return null
    }

    const data = await res.json()
    return data as OrderResponse
  } catch (error) {
    console.error('Error de red al obtener órdenes:', error)
    return null
  }
}
