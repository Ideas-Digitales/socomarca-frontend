export interface ContactDraft {
  rut: string;
  name: string;
  email: string;
  phone: string;
  /** Usuario de la sucursal. `null` hasta que la principal elige una. */
  branchUserId: number | null;
  authorized: boolean;
  address: string;
}

export interface PayOrderInput {
  shippingAddressId: number;
  paymentMethod: string;
  customerId?: number;
  paymentDocumentType: 'invoice' | 'receipt';
  notes?: string;
  contactId?: number | null;
}

/** RUT sin puntos, con guion y dígito verificador en mayúscula (`12345678-5`). */
export function normalizeContactRut(rut: string): string {
  const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleaned.length <= 1) return cleaned;

  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

export function isValidContactRut(rut: string): boolean {
  const normalized = normalizeContactRut(rut);
  const match = /^(\d{7,8})-([\dK])$/.exec(normalized);
  if (!match) return false;

  const body = match[1];
  const dv = match[2];
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expected = 11 - (sum % 11);
  const calculated = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);

  return dv === calculated;
}

export function contactFieldErrors(draft: ContactDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = draft.name.trim();
  const email = draft.email.trim();
  const phone = draft.phone.trim();
  const address = draft.address.trim();

  if (!draft.rut.trim()) errors.rut = 'Ingresa el RUT.';
  else if (!isValidContactRut(draft.rut)) errors.rut = 'RUT inválido.';

  if (!name) errors.name = 'Ingresa el nombre.';
  else if (name.length > 255) errors.name = 'El nombre admite hasta 255 caracteres.';

  if (!email) errors.email = 'Ingresa el correo.';
  else if (email.length > 255) errors.email = 'El correo admite hasta 255 caracteres.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Correo inválido.';

  if (!phone) errors.phone = 'Ingresa el teléfono.';
  else if (phone.length > 30) errors.phone = 'El teléfono admite hasta 30 caracteres.';

  if (!address) errors.address = 'Ingresa la dirección.';
  else if (address.length > 50) errors.address = 'La dirección admite hasta 50 caracteres.';

  return errors;
}

/**
 * `includeBranchUser` solo cuando la sucursal principal elige sucursal.
 * Si se omite, el contacto queda en el usuario autenticado.
 */
export function contactPayload(draft: ContactDraft, includeBranchUser = false) {
  const payload: {
    rut: string;
    name: string;
    email: string;
    phone: string;
    authorized: boolean;
    address: string;
    user_id?: number;
  } = {
    rut: normalizeContactRut(draft.rut),
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    authorized: draft.authorized,
    address: draft.address.trim(),
  };

  if (includeBranchUser && draft.branchUserId) payload.user_id = draft.branchUserId;

  return payload;
}

export function isOwnContact(
  contact: { user_id: number },
  currentUserId: number | null | undefined,
): boolean {
  return currentUserId != null && contact.user_id === currentUserId;
}

type ContactBranch = {
  name: string | null;
  branch_code?: string | null;
} | null;

/** «Mi sucursal» cuando el contacto es del usuario que compra; si no, el nombre de la secundaria. */
export function contactOwnershipLabel(
  contact: { user_id: number; branch?: { name: string | null } | null },
  currentUserId: number | null | undefined,
): string {
  if (isOwnContact(contact, currentUserId)) return "Mi sucursal";

  const name = contact.branch?.name?.trim();

  return name || "Otra sucursal";
}

/**
 * En el checkout de la sucursal principal, el contacto de otra sucursal se identifica
 * por su código. El contacto propio sigue como «Mi sucursal».
 */
export function contactCheckoutBranchLabel(
  contact: { user_id: number; branch?: ContactBranch },
  currentUserId: number | null | undefined,
): string {
  if (isOwnContact(contact, currentUserId)) return "Mi sucursal";

  const code = contact.branch?.branch_code?.trim();
  if (code) return code;

  const name = contact.branch?.name?.trim();

  return name || "Otra sucursal";
}

export function contactCheckoutLabel(
  contact: {
    name: string;
    rut: string;
    user_id: number;
    authorized: boolean;
    branch?: ContactBranch;
  },
  currentUserId: number | null | undefined,
): string {
  const branch = contactCheckoutBranchLabel(contact, currentUserId);
  const status = contact.authorized ? "" : " · No autorizado";

  return `${contact.name} · ${contact.rut} · ${branch}${status}`;
}

/** Solo un contacto autorizado puede acompañar la compra. */
export function canCheckoutWithContact(contact: { authorized: boolean }): boolean {
  return contact.authorized;
}

/** Cuerpo de `POST /orders/pay`. Omite `contact_id` cuando no hay contacto. */
export function payOrderBody(input: PayOrderInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    address_id: input.shippingAddressId,
    payment_method: input.paymentMethod,
    payment_document_type: input.paymentDocumentType,
  };

  if (input.customerId) body.customer_id = input.customerId;
  if (input.notes) body.notes = input.notes;
  if (input.contactId) body.contact_id = input.contactId;

  return body;
}
