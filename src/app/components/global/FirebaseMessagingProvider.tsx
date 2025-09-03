'use client';

import { useEffect, useState } from 'react';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';

export default function FirebaseMessagingProvider({ children }: { children: React.ReactNode }) {
  const { token, notification, requestPermission, clearNotification } = useFirebaseMessaging();
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied' | null>(null);

  useEffect(() => {
    // Solicitar permisos automáticamente cuando se carga la aplicación
    // Puedes cambiar esto para que sea manual si prefieres
    const initializeMessaging = async () => {
      // Check current permission status first
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
        
        // Only request if permission is default (not yet asked)
        if (Notification.permission === 'default') {
          const fcmToken = await requestPermission();
          setPermissionStatus(Notification.permission);
          
          if (fcmToken) {
            // Aquí puedes enviar el token a tu backend para guardarlo
            console.log('FCM Token obtenido:', fcmToken);
            // TODO: Enviar token al backend
            // await sendTokenToServer(fcmToken);
          }
        } else if (Notification.permission === 'granted') {
          // If already granted, just get the token
          const fcmToken = await requestPermission();
          if (fcmToken) {
            console.log('FCM Token obtenido:', fcmToken);
          }
        } else {
          console.log('Notifications are blocked. User needs to enable them manually.');
        }
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

