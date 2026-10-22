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

/**
 * Segundos que faltan hasta `cancelable_until`. Cero cuando esa fecha ya pasó.
 * Null si no hay fecha o no se puede leer.
 */
export function cancellationSecondsLeft(
  cancelableUntil: string | null,
  nowMs: number
): number | null {
  if (cancelableUntil == null || cancelableUntil.trim() === '') return null;

  const deadline = Date.parse(cancelableUntil);

  if (Number.isNaN(deadline)) return null;

  return Math.max(0, Math.floor((deadline - nowMs) / 1000));
}

/**
 * Tiempo visible del plazo. La fecha manda; `secondsRemaining` solo cubre
 * el primer instante si la fecha no viene o no se puede leer.
 */
export function visibleCancellationSeconds(
  cancelableUntil: string | null,
  secondsRemaining: number | null,
  nowMs: number
): number | null {
  const fromDeadline = cancellationSecondsLeft(cancelableUntil, nowMs);

  if (fromDeadline !== null) return fromDeadline;

  if (secondsRemaining == null || !Number.isFinite(secondsRemaining)) return null;

  return Math.max(0, Math.floor(secondsRemaining));
}

/** El botón se muestra mientras quede al menos un segundo. */
export function canCancelOwnOrder(secondsRemaining: number | null): boolean {
  return secondsRemaining != null && secondsRemaining > 0;
}

/** Texto corto junto al botón. `seconds` ya viene redondeado hacia abajo. */
export function formatCancellationRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  if (minutes <= 0) return `Quedan ${rest} s`;

  if (rest === 0) return `Quedan ${minutes} min`;

  return `Quedan ${minutes} min ${rest} s`;
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
