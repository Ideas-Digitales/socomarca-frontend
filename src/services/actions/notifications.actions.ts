'use server'

import { Notification, NotificationData } from '@/interfaces/notification.interface';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

interface CreateNotificationRequest {
  title: string;
  message: string;
  created_at: string;
}

interface BackendNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  sent_at: string;
}

interface NotificationsResponse {
  current_page: number;
  data: BackendNotification[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Obtener todas las notificaciones con paginación del backend
export const fetchAllNotifications = async (page: number = 1, perPage: number = 20): Promise<ActionResult<NotificationsResponse>> => {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    console.log('🔔 Obteniendo notificaciones paginadas - Página:', page, 'Por página:', perPage);
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('🔔 Headers enviados:', headers);
    
    const response = await fetch(`${BACKEND_URL}/notifications?page=${page}&per_page=${perPage}&sort=sent_at&order=desc`, {
      method: 'GET',
      headers,
    });

    console.log('🔔 Response status:', response.status);
    console.log('🔔 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('🔔 Error en la respuesta:', errorData);
      return {
        ok: false,
        data: null,
        error: errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`,
      };
    }

    const data: NotificationsResponse = await response.json();
    console.log('🔔 Datos paginados recibidos del backend:', data);
    console.log('🔔 Notificaciones en la respuesta:', data.data?.length || 0);
    console.log('🔔 Primera notificación:', data.data?.[0]);

    return {
      ok: true,
      data: data,
      error: null,
    };

  } catch (error) {
    console.error('Error fetching all notifications:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error inesperado al obtener las notificaciones',
    };
  }
};

// Obtener las últimas 5 notificaciones del backend
export const fetchLatestNotifications = async (): Promise<ActionResult<BackendNotification[]>> => {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    console.log('🔔 Haciendo petición a:', `${BACKEND_URL}/notifications?per_page=5`);
    console.log('🔔 Token disponible:', !!token);
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('🔔 Headers enviados:', headers);
    
    const response = await fetch(`${BACKEND_URL}/notifications?per_page=5&sort=sent_at&order=desc`, {
      method: 'GET',
      headers,
    });

    console.log('🔔 Response status:', response.status);
    console.log('🔔 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('🔔 Error en la respuesta:', errorData);
      return {
        ok: false,
        data: null,
        error: errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`,
      };
    }

    const data: NotificationsResponse = await response.json();
    console.log('🔔 Datos recibidos del backend:', data);
    console.log('🔔 Notificaciones en data.data:', data.data);

    return {
      ok: true,
      data: data.data || [],
      error: null,
    };

  } catch (error) {
    console.error('Error fetching latest notifications:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error inesperado al obtener las notificaciones',
    };
  }
};

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
  notificationData: CreateNotificationRequest
): Promise<ActionResult<any>> => {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        ok: false,
        data: null,
        error: 'Unauthorized: No token provided',
      };
    }

    const response = await fetch(`${BACKEND_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: notificationData.title,
        message: notificationData.message,
        created_at: notificationData.created_at
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        ok: false,
        data: null,
        error: errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      ok: true,
      data: data,
      error: null,
    };

  } catch (error) {
    console.error('Error creating notification:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error inesperado al crear la notificación',
    };
  }
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