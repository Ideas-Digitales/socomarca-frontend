import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/firebase/firebase';

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export const useFirebaseMessaging = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Registrar service worker
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Solicitar permisos y obtener token
  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const fcmToken = await requestNotificationPermission();
      setToken(fcmToken);
      return fcmToken;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Escuchar mensajes en primer plano
  useEffect(() => {
    const unsubscribe = onMessageListener()
      .then((payload: NotificationPayload) => {
        console.log('Received foreground message:', payload);
        setNotification(payload);
        
        // Mostrar notificación personalizada en el navegador
        if (payload.notification) {
          new Notification(payload.notification.title || 'Nueva notificación', {
            body: payload.notification.body,
            icon: '/icons/logo_plant-192.png',
            image: payload.notification.image,
          });
        }
      })
      .catch((err) => {
        console.log('Failed to receive foreground message:', err);
      });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Limpiar notificación
  const clearNotification = () => {
    setNotification(null);
  };

  return {
    token,
    notification,
    isLoading,
    requestPermission,
    clearNotification,
  };
};

