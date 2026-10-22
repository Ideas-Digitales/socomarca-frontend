import type { Order } from '@/interfaces/order.interface'
import type { Compra, ProductoCompra, Sucursal } from '@/app/components/mi-cuenta/ComprasSection'
import { DEFAULT_IMAGE } from '@/utils/assets'

/** Los montos de la orden llegan como string desde el backend. */
const toNumber = (value: unknown): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export function mapOrderToCompra(order: Order, currentUserId: number): Compra {
  const suc: Sucursal = {
    id: order.customer?.id ?? null,
    nombre: order.customer?.name ?? null,
    codigo: order.customer?.branch_code ?? null,
  };

  return {
    fecha: new Date(order.created_at).toLocaleDateString('es-CL'),
    numero: order.id.toString(),
    referencia: order.random_document_number,
    sucursal: suc,
    // Ej.: la sucursal principal compró para esta secundaria
    emitidoPor: order.user && order.user.id !== currentUserId ? order.user.name : null,
    notas: order.notes,
    hora: new Date(order.created_at).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    subtotal: toNumber(order.subtotal),
    iva: toNumber(order.vat),
    montoIva: toNumber(order.vat_amount),
    envio: toNumber(order.shipping_cost),
    // `amount` es lo que se cobró: productos + IVA + despacho
    total: toNumber(order.amount),
    estado: order.status,
    cancelableUntil: order.cancelable_until,
    cancelSecondsRemaining: order.cancel_seconds_remaining,
    productos: order.order_items.map((item): ProductoCompra => ({
      nombre: item.product.name,
      marca: `Marca ${item.product.brand_id}`,
      imagen: item.product.image || DEFAULT_IMAGE,
      precio: toNumber(item.price),
      cantidad: item.quantity,
      total: toNumber(item.total),
    })),
  }
}
