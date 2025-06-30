import type { Order } from '@/interfaces/order.interface'
import type { Compra, ProductoCompra } from '@/app/components/mi-cuenta/ComprasSection'

export function mapOrderToCompra(order: Order): Compra {
  return {
    fecha: new Date(order.created_at).toLocaleDateString('es-CL'),
    numero: order.id.toString(),
    hora: new Date(order.created_at).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    total: order.amount,
    productos: order.order_items.map((item): ProductoCompra => ({
      nombre: item.product.name,
      marca: `Marca ${item.product.brand_id}`,
      imagen: item.product.image || '/assets/global/logo_plant.png',
      precio: parseInt(item.price),
      cantidad: item.quantity,
    })),
  }
}
