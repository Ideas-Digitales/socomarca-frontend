export interface ContactDraft {
  rut: string;
  name: string;
  email: string;
  phone: string;
  branchCode: string;
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
  const branchCode = draft.branchCode.trim();
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

  if (!branchCode) errors.branchCode = 'Ingresa el código de sucursal.';
  else if (branchCode.length > 3) errors.branchCode = 'El código de sucursal admite hasta 3 caracteres.';

  if (!address) errors.address = 'Ingresa la dirección.';
  else if (address.length > 50) errors.address = 'La dirección admite hasta 50 caracteres.';

  return errors;
}

export function contactPayload(draft: ContactDraft) {
  return {
    rut: normalizeContactRut(draft.rut),
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    branch_code: draft.branchCode.trim(),
    authorized: draft.authorized,
    address: draft.address.trim(),
  };
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
