'use client';

import { useEffect } from 'react';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';

export default function FirebaseMessagingProvider({ children }: { children: React.ReactNode }) {
  const { token, notification, requestPermission, clearNotification } = useFirebaseMessaging();

  useEffect(() => {
    // Solicitar permisos automáticamente cuando se carga la aplicación
    // Puedes cambiar esto para que sea manual si prefieres
    const initializeMessaging = async () => {
      const fcmToken = await requestPermission();
      if (fcmToken) {
        // Aquí puedes enviar el token a tu backend para guardarlo
        console.log('FCM Token obtenido:', fcmToken);
        // TODO: Enviar token al backend
        // await sendTokenToServer(fcmToken);
      }
    };

    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      initializeMessaging();
    }
  }, [requestPermission]);

  // Manejar notificaciones en primer plano
  useEffect(() => {
    if (notification) {
      // Aquí puedes mostrar una notificación personalizada en tu UI
      console.log('Nueva notificación recibida:', notification);
      
      // Ejemplo: mostrar un toast o modal
      // showToast(notification.notification?.title, notification.notification?.body);
      
      // Limpiar después de mostrar
      setTimeout(() => {
        clearNotification();
      }, 5000);
    }
  }, [notification, clearNotification]);

  return <>{children}</>;
}

