'use server'

import { Notification, NotificationData } from '@/interfaces/notification.interface';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

// Obtener notificaciones
export const fetchGetNotifications = async (): Promise<ActionResult<Notification[]>> => {
  // Mock data para UI - Promociones y ofertas de supermercado
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Black Friday - 50% OFF',
      message: 'No te pierdas nuestras ofertas del Black Friday. Hasta 50% de descuento en productos de limpieza y cuidado personal. Válido hasta el 30 de noviembre.',
      type: 'success',
      isActive: true,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Navidad - Descuento Especial',
      message: 'Celebra la Navidad con nosotros. 20% de descuento en vinos, chocolates y productos navideños. Válido hasta el 24 de diciembre.',
      type: 'info',
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString()
    },
    {
      id: '3',
      title: 'Semana Saludable - 30% OFF',
      message: 'Semana Saludable en Socomarca. 30% de descuento en frutas, verduras y productos orgánicos. Solo hasta el domingo.',
      type: 'success',
      isActive: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      sentAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '4',
      title: 'Flash Sale - 2x1',
      message: 'Flash Sale por tiempo limitado. Lleva 2 productos por el precio de 1 en la categoría "Bebidas". Solo hoy.',
      type: 'warning',
      isActive: false,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      sentAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: '5',
      title: 'Cumpleaños - Descuento Especial',
      message: 'Feliz cumpleaños. Tienes un descuento especial del 25% en tu próxima compra. Usa el código: CUMPLE25',
      type: 'info',
      isActive: true,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      sentAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: '6',
      title: 'Mantenimiento Programado',
      message: 'El sitio web estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM. Disculpa las molestias.',
      type: 'warning',
      isActive: true,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      scheduledFor: new Date(Date.now() + 86400000 * 3).toISOString()
    },
    {
      id: '7',
      title: 'Nuevos Productos Disponibles',
      message: 'Hemos agregado nuevos productos orgánicos y sin gluten a nuestro catálogo. ¡Échales un vistazo!',
      type: 'info',
      isActive: true,
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      sentAt: new Date(Date.now() - 518400000).toISOString()
    },
    {
      id: '8',
      title: 'Horario Especial de Fiestas',
      message: 'Durante las fiestas de fin de año, nuestros horarios de atención serán de 8:00 AM a 10:00 PM.',
      type: 'info',
      isActive: true,
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      scheduledFor: new Date(Date.now() + 86400000 * 7).toISOString()
    }
  ];

  return {
    ok: true,
    data: mockNotifications,
    error: null,
  };
};

// Crear notificación
export const fetchCreateNotification = async (
  notificationData: NotificationData
): Promise<ActionResult<any>> => {
  // Simular creación exitosa para UI
  return {
    ok: true,
    data: { id: Date.now().toString() },
    error: null,
  };
};

// Eliminar notificación
export const fetchDeleteNotification = async (
  notificationId: string
): Promise<ActionResult<any>> => {
  // Simular eliminación exitosa para UI
  return {
    ok: true,
    data: null,
    error: null,
  };
};

// Obtener notificaciones públicas (para el sitio principal)
export const fetchGetPublicNotifications = async (): Promise<ActionResult<Notification[]>> => {
  // Mock data para UI - solo notificaciones activas de promociones de supermercado
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Black Friday - 50% OFF',
      message: 'No te pierdas nuestras ofertas del Black Friday. Hasta 50% de descuento en productos de limpieza y cuidado personal.',
      type: 'success',
      isActive: true,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Navidad - Descuento Especial',
      message: 'Celebra la Navidad con nosotros. 20% de descuento en vinos, chocolates y productos navideños.',
      type: 'info',
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString()
    },
    {
      id: '3',
      title: 'Semana Saludable - 30% OFF',
      message: 'Semana Saludable en Socomarca. 30% de descuento en frutas, verduras y productos orgánicos.',
      type: 'success',
      isActive: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      sentAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '6',
      title: 'Mantenimiento Programado',
      message: 'El sitio web estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM. Disculpa las molestias.',
      type: 'warning',
      isActive: true,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      scheduledFor: new Date(Date.now() + 86400000 * 3).toISOString()
    }
  ];

  return {
    ok: true,
    data: mockNotifications.filter(n => n.isActive),
    error: null,
  };
};

// Actualizar notificación
export const fetchUpdateNotification = async (
  notificationId: string,
  notificationData: Partial<NotificationData>
): Promise<ActionResult<any>> => {
  // Simular actualización exitosa para UI
  return {
    ok: true,
    data: { id: notificationId },
    error: null,
  };
}; 