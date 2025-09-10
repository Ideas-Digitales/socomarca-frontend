'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
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

  // Log del token para debugging
  React.useEffect(() => {
    if (token) {
      console.log('🔑 FCM Token:', token);
    }
  }, [token]);

  // Transform NotificationPayload to Notification format
  const transformedNotifications: Notification[] = notifications.map((payload, index) => ({
    id: `notification-${Date.now()}-${index}`,
    title: payload.title || 'Nueva notificación',
    message: payload.body || '',
    type: 'info' as const,
    isActive: true,
    createdAt: new Date().toISOString(),
  }));

  return (
    <>
      <NotificationBanner notifications={transformedNotifications} />
      {children}
    </>
  );
} 