'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { fetchGetNotifications, fetchCreateNotification, fetchDeleteNotification } from '@/services/actions/notifications.actions';
import { Notification } from '@/interfaces/notification.interface';

export default function Notificaciones() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    isActive: true,
    scheduledFor: ''
  });

  // Load notifications
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await fetchGetNotifications();
      if (result.ok && result.data) {
        setNotifications(result.data);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al cargar las notificaciones'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error inesperado al cargar las notificaciones'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Handle form submission
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage(null);

    try {
      const result = await fetchCreateNotification(formData);
      if (result.ok) {
                 setMessage({
           type: 'success',
           text: 'Oferta creada exitosamente'
         });
        setShowCreateForm(false);
        setFormData({
          title: '',
          message: '',
          type: 'info',
          isActive: true,
          scheduledFor: ''
        });
        loadNotifications(); // Reload the list
      } else {
                 setMessage({
           type: 'error',
           text: result.error || 'Error al crear la oferta'
         });
      }
    } catch (error) {
             setMessage({
         type: 'error',
         text: 'Error inesperado al crear la oferta'
       });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete notification
     const handleDeleteNotification = async (id: string) => {
     if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
       return;
     }

    try {
      const result = await fetchDeleteNotification(id);
      if (result.ok) {
                 setMessage({
           type: 'success',
           text: 'Oferta eliminada exitosamente'
         });
        loadNotifications(); // Reload the list
      } else {
                 setMessage({
           type: 'error',
           text: result.error || 'Error al eliminar la oferta'
         });
      }
    } catch (error) {
             setMessage({
         type: 'error',
         text: 'Error inesperado al eliminar la oferta'
       });
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4" data-cy="loading-spinner"></div>
            <p className="text-slate-600">Cargando notificaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BellIcon className="w-8 h-8 text-lime-600" />
                     <h1 className="text-2xl font-bold text-slate-800">
             Gestión de Ofertas del Supermercado
           </h1>
        </div>
                 <div className="flex gap-4">
           <button
             onClick={() => setShowCreateForm(true)}
             className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 text-sm flex items-center gap-2"
             data-cy="new-notification-button"
           >
             <PlusIcon className="w-5 h-5" />
             Nueva oferta
           </button>
         </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
          data-cy={message.type === 'success' ? 'success-message' : 'error-message'}
        >
          {message.text}
        </div>
      )}

             {/* Create Form Modal */}
       {showCreateForm && (
         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-semibold text-slate-800">
                 Crear Nueva Oferta
               </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">
                   Título de la oferta
                 </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                     placeholder="Ej: 🥬 Semana Saludable - 30% OFF"
                  required
                  data-cy="notification-title-input"
                />
              </div>

              <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">
                   Descripción de la oferta
                 </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  rows={4}
                                     placeholder="Describe los detalles de la oferta, descuentos, productos, fechas límite, etc..."
                  required
                  data-cy="notification-message-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">
                     Tipo de oferta
                   </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    data-cy="notification-type-select"
                  >
                                         <option value="info">Información General</option>
                     <option value="warning">Oferta por Tiempo Limitado</option>
                     <option value="success">Gran Descuento</option>
                     <option value="error">Oferta Urgente</option>
                  </select>
                </div>

                <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">
                     Fecha de inicio (opcional)
                   </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                />
                                 <label htmlFor="isActive" className="text-sm text-slate-700">
                   Activar oferta inmediatamente
                 </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  data-cy="create-notification-button"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                                     {isCreating ? 'Creando...' : 'Crear oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-slate-200">
                     <h2 className="text-lg font-semibold text-slate-800">
             Ofertas del Supermercado ({notifications.length})
           </h2>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <BellIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                         <h3 className="text-lg font-medium text-slate-600 mb-2">
               No hay ofertas activas
             </h3>
             <p className="text-slate-500 mb-4">
               Crea tu primera oferta para atraer más clientes
             </p>
             <button
               onClick={() => setShowCreateForm(true)}
               className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 text-sm flex items-center gap-2 mx-auto"
             >
               <PlusIcon className="w-5 h-5" />
               Crear oferta
             </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-slate-50" data-cy="notification-item">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                      <h3 className="text-lg font-medium text-slate-800" data-cy="notification-title">
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {notification.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activa
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactiva
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        Creada: {formatDate(notification.createdAt)}
                      </div>
                      {notification.scheduledFor && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          Programada: {formatDate(notification.scheduledFor)}
                        </div>
                      )}
                      {notification.sentAt && (
                        <div className="flex items-center gap-1">
                          <PaperAirplaneIcon className="w-4 h-4" />
                          Enviada: {formatDate(notification.sentAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                                         <button
                       onClick={() => handleDeleteNotification(notification.id)}
                       className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                       title="Eliminar oferta"
                       data-cy="delete-notification-button"
                     >
                       <TrashIcon className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 