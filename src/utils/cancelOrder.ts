/** Entrada de menú y ruta de la pantalla de cancelación. */
export const CANCEL_ORDER_PATH = '/admin/cancelar-orden';
export const CANCEL_ORDER_MENU_LABEL = 'Cancelar orden';

const CANCEL_ORDER_ROLES = ['admin', 'superadmin'] as const;

/** Deben coincidir con `PERMISOS.ORDERS` en `src/configs/permisos.ts`. */
export const CANCEL_ORDER_PERMISSIONS = ['read-all-orders', 'cancel-orders'] as const;

export type CancelOrderFieldErrors = Record<string, string[]>;

export interface CancelOrderResult {
  ok: boolean;
  status: number;
  /** Texto de la API. En un 422 con `errors.order_number` es null: el detalle va en `fieldErrors`. */
  message: string | null;
  fieldErrors?: CancelOrderFieldErrors;
}

/**
 * El menú solo existe para admin y superadmin. Otros roles no llegan a esta pantalla.
 */
export function showsCancelOrderMenu(role: string | null | undefined): boolean {
  return CANCEL_ORDER_ROLES.some((allowed) => allowed === role);
}

/**
 * La pantalla exige los dos permisos, aunque el rol ya sea admin o superadmin.
 */
export function canAccessCancelOrder(
  role: string | null | undefined,
  permissions: string[] | null
): boolean {
  if (!showsCancelOrderMenu(role) || !permissions) return false;

  return CANCEL_ORDER_PERMISSIONS.every((permission) =>
    permissions.includes(permission)
  );
}

/**
 * Arma el cuerpo de `POST /orders/cancel`.
 * Un valor vacío o no numérico se envía igual para que el 422 de la API se muestre tal cual.
 */
export function buildCancelOrderBody(raw: string): {
  order_number: number | string | null;
} {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { order_number: null };
  }

  if (/^\d+$/.test(trimmed)) {
    return { order_number: Number(trimmed) };
  }

  return { order_number: trimmed };
}

/** Código y estado del pago, lo mínimo para saber si el cliente puede cancelar. */
export interface OrderPaymentRef {
  code: string;
  status: string;
}

export interface OwnOrderCancelInput {
  emitidoPor: string | null;
  estado: string;
  pagos: OrderPaymentRef[];
}

/**
 * Conserva `payment_method.code` y `status` de `GET /orders`.
 * Un pago sin esos datos no sirve para mostrar la acción.
 */
export function mapOrderPayments(
  payments: ReadonlyArray<{
    status?: string | null;
    payment_method?: { code?: string | null } | null;
  }> | null | undefined
): OrderPaymentRef[] {
  if (!payments) return [];

  return payments.flatMap((payment) => {
    const code = payment.payment_method?.code;
    const status = payment.status;

    if (!code || !status) return [];

    return [{ code, status }];
  });
}

/**
 * El cliente solo cancela un pedido que él realizó, que no está cancelado
 * y que sigue a crédito (`random_credit`) en `processing`.
 */
export function canCancelOwnOrder(order: OwnOrderCancelInput): boolean {
  if (order.emitidoPor) return false;
  if (order.estado === 'canceled') return false;

  return order.pagos.some(
    (pago) => pago.code === 'random_credit' && pago.status === 'processing'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function messageList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  const messages = value.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== ''
  );

  return messages.length > 0 ? messages : null;
}

function apiMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim() !== '') {
    return body.trim();
  }

  if (isRecord(body) && typeof body.message === 'string' && body.message.trim() !== '') {
    return body.message;
  }

  return null;
}

/**
 * Conserva el texto que devolvió la API.
 * Un 422 muestra `errors.order_number` junto al input y `message` solo si no hay detalle.
 */
export function parseCancelOrderResponse(
  status: number,
  body: unknown
): CancelOrderResult {
  const message = apiMessage(body);

  if (status >= 200 && status < 300) {
    return { ok: true, status, message };
  }

  if (status === 422 && isRecord(body) && isRecord(body.errors)) {
    const fieldErrors: CancelOrderFieldErrors = {};

    for (const [field, value] of Object.entries(body.errors)) {
      const messages = messageList(value);
      if (messages) fieldErrors[field] = messages;
    }

    const hasFieldDetail = (fieldErrors.order_number?.length ?? 0) > 0;

    return {
      ok: false,
      status,
      message: hasFieldDetail ? null : message,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  return { ok: false, status, message };
}
