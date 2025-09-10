'use client';

import { useNotifications } from '@/hooks/useNotifications';
import NotificationBanner from './NotificationBanner';
import { Notification } from '@/interfaces/notification.interface';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export default function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { notifications } = useNotifications();

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