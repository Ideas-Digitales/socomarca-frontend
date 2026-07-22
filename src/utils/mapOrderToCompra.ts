import type { Order } from '@/interfaces/order.interface'
import type { Compra, ProductoCompra, Sucursal } from '@/app/components/mi-cuenta/ComprasSection'
import { DEFAULT_IMAGE } from '@/utils/assets'

export function mapOrderToCompra(order: Order): Compra {
  const suc: Sucursal = {
    id: order.branch?.id,
    nombre: order.branch?.name,
    codigo: order.branch?.code,
  };

  return {
    fecha: new Date(order.created_at).toLocaleDateString('es-CL'),
    numero: order.id.toString(),
    referencia: order.random_document_number,
    sucursal: suc,
    notas: order.notes,
    hora: new Date(order.created_at).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    total: order.amount,
    estado: order.status,
    productos: order.order_items.map((item): ProductoCompra => ({
      nombre: item.product.name,
      marca: `Marca ${item.product.brand_id}`,
      imagen: item.product.image || DEFAULT_IMAGE,
      precio: parseInt(item.price),
      cantidad: item.quantity,
    })),
  }
}
