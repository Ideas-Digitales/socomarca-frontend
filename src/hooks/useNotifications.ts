import { useState, useEffect } from 'react';
import { fetchGetPublicNotifications } from '@/services/actions/notifications.actions';
import { Notification } from '@/interfaces/notification.interface';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchGetPublicNotifications();
      if (result.ok && result.data) {
        setNotifications(result.data);
      } else {
        setError(result.error || 'Error al cargar las notificaciones');
      }
    } catch (err) {
      setError('Error inesperado al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
    refetch: loadNotifications
  };
}; 