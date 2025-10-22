'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { app, vapid } from '../../lib/firebase';
import { sendFCMToken } from '@/services/actions/fcm.actions';

interface NotificationPayload {
  title?: string;
  body?: string;
  icon?: string;
}

interface NotificationContextType {
  token: string | null;
  notifications: NotificationPayload[]; // Para el banner (se auto-limpian)
  dropdownNotifications: NotificationPayload[]; // Para el dropdown (persisten hasta que se abra)
  unreadCount: number; // Contador de notificaciones no leídas
  isSupported: boolean;
  tokenSentToServer: boolean; // Estado para saber si el token se envió al servidor
  tokenError: string | null; // Error al enviar token al servidor
  requestPermission: () => Promise<string | null>;
  clearNotifications: () => void;
  clearDropdownNotifications: () => void; // Nueva función para limpiar dropdown
  addTestNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]); // Para banner
  const [dropdownNotifications, setDropdownNotifications] = useState<NotificationPayload[]>([]); // Para dropdown
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [tokenSentToServer, setTokenSentToServer] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);


  useEffect(() => {
    // Verificar si estamos en el cliente y si Firebase Messaging es soportado
    if (typeof window !== 'undefined') {
      setIsSupported(true);
      
      try {
        const _messaging = getMessaging(app);
        setMessaging(_messaging);

        // Configurar listener para mensajes cuando la app está abierta
        const unsubscribe = onMessage(_messaging, (payload) => {
          const notification = {
            title: payload.notification?.title || 'Nueva notificación',
            body: payload.notification?.body || '',
            icon: payload.notification?.icon || '/assets/global/logo.png'
          };

          // Las notificaciones FCM ahora solo van al dropdown del NotificationBell
          setDropdownNotifications(prev => [notification, ...prev]);
        });

        return () => unsubscribe();
      } catch (error) {
        setIsSupported(false);
      }
    }
  }, []);

  // Función para enviar token al servidor
  const sendTokenToServer = async (fcmToken: string) => {
    try {
      setTokenError(null);
      const result = await sendFCMToken(fcmToken);
      
      if (result.ok) {
        setTokenSentToServer(true);
        console.log('Token FCM enviado al servidor exitosamente:', result.data?.message);
      } else {
        setTokenError(result.error || 'Error al enviar token al servidor');
        console.error('Error enviando token FCM:', result.error);
      }
    } catch (error) {
      setTokenError(error instanceof Error ? error.message : 'Error inesperado');
      console.error('Error inesperado enviando token FCM:', error);
    }
  };

  const requestPermission = async (): Promise<string | null> => {
    if (!messaging || !isSupported) {
      return null;
    }

    try {
      // Solo obtener token FCM - sin solicitar permisos de notificaciones nativas
      const fcmToken = await getToken(messaging, {
        vapidKey: vapid,
      });
      
      if (fcmToken) {
        setToken(fcmToken);
        
        // Enviar el token al backend automáticamente
        await sendTokenToServer(fcmToken);
        
        return fcmToken;
      } else {
        return null;
      }
    } catch (error) {
      setTokenError(error instanceof Error ? error.message : 'Error obteniendo token FCM');
      return null;
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
    
    // Las notificaciones de prueba también van solo al dropdown
    setDropdownNotifications(prev => [testNotification, ...prev]);
  };


  // Contador de notificaciones no leídas (solo dropdown)
  const unreadCount = dropdownNotifications.length;

  const value: NotificationContextType = {
    token,
    notifications,
    dropdownNotifications,
    unreadCount,
    isSupported,
    tokenSentToServer,
    tokenError,
    requestPermission,
    clearNotifications,
    clearDropdownNotifications,
    addTestNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
