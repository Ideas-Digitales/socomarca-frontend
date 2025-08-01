'use client';

import { useNotifications } from '@/hooks/useNotifications';
import NotificationBanner from './NotificationBanner';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export default function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { notifications, isLoading, error } = useNotifications();

  return (
    <>
      <NotificationBanner notifications={notifications} />
      {children}
    </>
  );
} 