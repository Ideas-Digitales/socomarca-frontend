'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBanner from './NotificationBanner';
import { Notification } from '@/interfaces/notification.interface';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export default function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { notifications, token, requestPermission, isSupported } = useNotifications();

  // Solicitar permisos automáticamente cuando el componente se monta
  React.useEffect(() => {
    if (isSupported && !token) {
      requestPermission();
    }
  }, [isSupported, token, requestPermission]);



  // Las notificaciones FCM ahora se muestran solo en el dropdown del NotificationBell
  // No las enviamos al NotificationBanner
  const transformedNotifications: Notification[] = [];

  return (
    <>
      <NotificationBanner notifications={transformedNotifications} />
      {children}
    </>
  );
} 