'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Messaging } from 'firebase/messaging';
import { app, vapid } from '../../lib/firebase';
import { sendFCMToken } from '@/services/actions/fcm.actions';
import { fetchLatestNotifications } from '@/services/actions/notifications.actions';

interface NotificationPayload {
  title?: string;
  body?: string;
  icon?: string;
  sent_at?: string;
  id?: string | number;
}

interface NotificationContextType {
  token: string | null;
  notifications: NotificationPayload[]; // Para el banner (se auto-limpian)
  dropdownNotifications: NotificationPayload[]; // Para el dropdown (combinadas: históricas + tiempo real)
  historicalNotifications: NotificationPayload[]; // Notificaciones del backend (siempre visibles)
  realtimeNotifications: NotificationPayload[]; // Notificaciones FCM (se pueden limpiar)
  unreadCount: number; // Contador de notificaciones no leídas
  isSupported: boolean;
  tokenSentToServer: boolean; // Estado para saber si el token se envió al servidor
  tokenError: string | null; // Error al enviar token al servidor
  requestPermission: () => Promise<string | null>;
  clearNotifications: () => void;
  clearDropdownNotifications: () => void; // Nueva función para limpiar solo las de tiempo real
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
  const [historicalNotifications, setHistoricalNotifications] = useState<NotificationPayload[]>([]);
  const [realtimeNotifications, setRealtimeNotifications] = useState<NotificationPayload[]>([]);


  useEffect(() => {
    // Verificar si estamos en el cliente y si Firebase Messaging es soportado
    if (typeof window !== 'undefined') {
      // Detectar si estamos en Capacitor iOS
      const Capacitor = (window as any).Capacitor;
      const isCapacitorIOS = Capacitor && Capacitor.getPlatform() === 'ios';
      
      // Solo deshabilitar Firebase Messaging en iOS (no soporta Service Workers)
      // Android y web pueden usar FCM normalmente
      if (!isCapacitorIOS) {
        setIsSupported(true);
        
        // Importar Firebase Messaging dinámicamente solo cuando no estamos en iOS
        import('firebase/messaging').then(({ getMessaging, onMessage }) => {
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

              // Las notificaciones FCM van a realtimeNotifications
              setRealtimeNotifications(prev => [notification, ...prev]);
            });

            return () => unsubscribe();
          } catch (error) {
            console.log('Firebase Messaging no soportado:', error);
            setIsSupported(false);
          }
        }).catch((error) => {
          console.log('Error cargando Firebase Messaging:', error);
          setIsSupported(false);
        });
      } else {
        console.log('iOS detectado - Firebase Messaging deshabilitado (usar @capacitor/push-notifications)');
        setIsSupported(false);
      }
    }
  }, []);

  // Cargar notificaciones históricas al inicializar
  useEffect(() => {
    const loadHistoricalNotifications = async () => {
      try {
        console.log('🔔 Cargando notificaciones históricas...');
        const result = await fetchLatestNotifications();
        console.log('🔔 Resultado de fetchLatestNotifications:', result);
        
        if (result.ok && result.data) {
          // Convertir las notificaciones del backend al formato del contexto
          const formattedNotifications: NotificationPayload[] = result.data.map(notification => ({
            id: notification.id,
            title: notification.title,
            body: notification.message,
            sent_at: notification.sent_at,
            icon: '/assets/global/logo.png'
          }));
          
          console.log('🔔 Notificaciones formateadas:', formattedNotifications);
          setHistoricalNotifications(formattedNotifications);
        } else {
          console.log('🔔 No se pudieron cargar las notificaciones:', result.error);
        }
      } catch (error) {
        console.error('🔔 Error loading historical notifications:', error);
      }
    };

    loadHistoricalNotifications();
  }, []);

  // Combinar notificaciones históricas y en tiempo real para el dropdown
  useEffect(() => {
    console.log('🔔 Combinando notificaciones:', {
      realtimeCount: realtimeNotifications.length,
      historicalCount: historicalNotifications.length,
      realtime: realtimeNotifications,
      historical: historicalNotifications
    });
    setDropdownNotifications([...realtimeNotifications, ...historicalNotifications]);
  }, [realtimeNotifications, historicalNotifications]);

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
      // Importar getToken dinámicamente
      const { getToken } = await import('firebase/messaging');
      
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
    setRealtimeNotifications([]);
  };

  // Función para agregar notificación de prueba
  const addTestNotification = () => {
    const testNotification = {
      title: 'Notificación de prueba',
      body: 'Esta es una notificación simulada para testing',
      icon: '/assets/global/logo.png'
    };
    
    // Las notificaciones de prueba van a realtimeNotifications
    setRealtimeNotifications(prev => [testNotification, ...prev]);
  };



  // Contador de notificaciones no leídas (solo dropdown)
  const unreadCount = dropdownNotifications.length;

  const value: NotificationContextType = {
    token,
    notifications,
    dropdownNotifications,
    historicalNotifications,
    realtimeNotifications,
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
