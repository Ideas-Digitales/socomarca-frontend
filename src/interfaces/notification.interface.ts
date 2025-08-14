export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
}

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive?: boolean;
  scheduledFor?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}

export interface CreateNotificationResponse {
  id: string;
  message: string;
} 