'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export default function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { token, requestPermission, isSupported } = useNotifications();

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

  return (
    <>
      {children}
    </>
  );
} 