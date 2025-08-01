'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/interfaces/notification.interface';

interface NotificationBannerProps {
  notifications?: Notification[];
}

export default function NotificationBanner({ notifications = [] }: NotificationBannerProps) {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Filtrar notificaciones activas y no descartadas
    const active = notifications.filter(
      notification => 
        notification.isActive && 
        !dismissedNotifications.includes(notification.id)
    );
    setActiveNotifications(active);
  }, [notifications, dismissedNotifications]);

  const handleDismiss = (notificationId: string) => {
    setDismissedNotifications(prev => [...prev, notificationId]);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`border-b ${getTypeStyles(notification.type)} px-4 py-3`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getTypeIcon(notification.type)}</span>
              <div>
                <h3 className="font-medium text-sm">
                  {notification.title}
                </h3>
                <p className="text-sm opacity-90">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar notificación"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 