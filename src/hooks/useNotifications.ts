'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { app, vapid } from '../../lib/firebase';
// Removido react-toastify - usaremos notificaciones nativas

interface NotificationPayload {
  title?: string;
  body?: string;
  icon?: string;
}

interface UseNotificationsReturn {
  token: string | null;
  notifications: NotificationPayload[]; // Para el banner (se auto-limpian)
  dropdownNotifications: NotificationPayload[]; // Para el dropdown (persisten hasta que se abra)
  unreadCount: number; // Contador de notificaciones no leídas
  isSupported: boolean;
  requestPermission: () => Promise<void>;
  clearNotifications: () => void;
  clearDropdownNotifications: () => void; // Nueva función para limpiar dropdown
  addTestNotification: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]); // Para banner
  const [dropdownNotifications, setDropdownNotifications] = useState<NotificationPayload[]>([]); // Para dropdown
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si estamos en el cliente y si Firebase Messaging es soportado
    if (typeof window !== 'undefined') {
      setIsSupported(true);
      
      try {
        const _messaging = getMessaging(app);
        setMessaging(_messaging);

        // Configurar listener para mensajes cuando la app está abierta
        const unsubscribe = onMessage(_messaging, (payload) => {
          console.log('📱 Notificación recibida:', payload);
          
          const notification = {
            title: payload.notification?.title || 'Nueva notificación',
            body: payload.notification?.body || '',
            icon: payload.notification?.icon || '/assets/global/logo.png'
          };

          // Agregar a ambos estados: banner y dropdown
          setNotifications(prev => [notification, ...prev]);
          setDropdownNotifications(prev => [notification, ...prev]);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error inicializando Firebase Messaging:', error);
        setIsSupported(false);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!messaging || !isSupported) {
      console.warn('Firebase Messaging no está disponible');
      return;
    }

    try {
      // Solo obtener token FCM - sin solicitar permisos de notificaciones nativas
      const fcmToken = await getToken(messaging, {
        vapidKey: vapid,
      });
      
      if (fcmToken) {
        console.log('🔑 Token FCM obtenido:', fcmToken);
        setToken(fcmToken);
        
        // Aquí podrías enviar el token al backend para asociarlo con el usuario
        // await sendTokenToServer(fcmToken);
      } else {
        console.warn('⚠️ No se pudo obtener el token FCM');
      }
    } catch (error) {
      console.error('❌ Error obteniendo token FCM:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearDropdownNotifications = () => {
    setDropdownNotifications([]);
  };

  // Función para agregar notificación de prueba
  const addTestNotification = () => {
    const testNotification = {
      title: 'Notificación de prueba',
      body: 'Esta es una notificación simulada para testing',
      icon: '/assets/global/logo.png'
    };
    
    console.log('🧪 Agregando notificación de prueba:', testNotification);
    setNotifications(prev => [testNotification, ...prev]);
    setDropdownNotifications(prev => [testNotification, ...prev]);
  };

  // Contador de notificaciones no leídas (solo dropdown)
  const unreadCount = dropdownNotifications.length;

  return {
    token,
    notifications,
    dropdownNotifications,
    unreadCount,
    isSupported,
    requestPermission,
    clearNotifications,
    clearDropdownNotifications,
    addTestNotification,
  };
};

// Hook para obtener solo el token (útil para enviar al backend)
export const useNotificationToken = () => {
  const { token, requestPermission, isSupported } = useNotifications();
  
  useEffect(() => {
    // Auto-obtener token cuando el hook se monta
    if (isSupported && !token) {
      requestPermission();
    }
  }, [isSupported, token, requestPermission]);

  return token;
};