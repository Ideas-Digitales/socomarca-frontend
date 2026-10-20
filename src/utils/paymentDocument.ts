export const PAYMENT_DOCUMENT_OPTIONS = [
  { value: 'invoice', label: 'Factura' },
  { value: 'receipt', label: 'Boleta' },
] as const;

export type PaymentDocumentType = (typeof PAYMENT_DOCUMENT_OPTIONS)[number]['value'];

/** Boleta sigue siendo la opción marcada al entrar al checkout. */
export const DEFAULT_PAYMENT_DOCUMENT_TYPE: PaymentDocumentType = 'receipt';
