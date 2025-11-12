'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { fetchCreateNotification, fetchAllNotifications } from '@/services/actions/notifications.actions';

export default function Notificaciones() {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    details?: string;
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  // Notifications history states
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    user_id: number;
    title: string;
    message: string;
    sent_at: string;
  }>>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isRefreshingAfterCreate, setIsRefreshingAfterCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [perPage] = useState(10);

  // Handle form submission
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage(null);

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const result = await fetchCreateNotification({
        title: formData.title,
        message: formData.message,
        created_at: currentDate
      });

      if (result.ok) {
        setMessage({
          type: 'success',
          text: 'Notificación enviada exitosamente',
          details: `Título: "${formData.title}" | Mensaje: "${formData.message}" | Fecha: ${currentDate} | Respuesta: ${JSON.stringify(result.data)}`
        });
        setFormData({
          title: '',
          message: ''
        });
        
        console.log('✅ Notificación enviada exitosamente, recargando tabla...');
        
        // Recargar la tabla después de enviar exitosamente
        setIsRefreshingAfterCreate(true);
        try {
          await loadNotifications(1, true);
          setCurrentPage(1);
          console.log('✅ Tabla recargada correctamente');
        } catch (refreshError) {
          console.error('❌ Error al recargar la tabla:', refreshError);
        } finally {
          setIsRefreshingAfterCreate(false);
        }
      } else {
        setMessage({
          type: 'error',
          text: 'Error al enviar la notificación',
          details: `Error: ${result.error || 'Error desconocido'}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error inesperado al enviar la notificación',
        details: `Error: ${error instanceof Error ? error.message : 'Error inesperado'}`
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Load notifications from backend
  const loadNotifications = async (page: number, isRefresh: boolean = false) => {
    if (!isRefresh) {
      setIsLoadingNotifications(true);
    }
    try {
      const result = await fetchAllNotifications(page, perPage);
      if (result.ok && result.data) {
        setNotifications(result.data.data);
        setCurrentPage(result.data.current_page);
        setTotalPages(result.data.last_page);
        setTotalNotifications(result.data.total);
      } else {
        console.error('Error loading notifications:', result.error);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      if (!isRefresh) {
        setIsLoadingNotifications(false);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadNotifications(page);
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications(1);
  }, []);

  // Manual refresh function
  const handleRefreshTable = async () => {
    setIsRefreshingAfterCreate(true);
    try {
      await loadNotifications(currentPage, true);
      console.log('🔄 Tabla recargada manualmente');
    } catch (error) {
      console.error('❌ Error al recargar la tabla:', error);
    } finally {
      setIsRefreshingAfterCreate(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BellIcon className="w-8 h-8 text-lime-600" />
        <h1 className="text-2xl font-bold text-slate-800">
          Crear Nueva Notificación
        </h1>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm border-l-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-400'
              : 'bg-red-50 text-red-800 border-red-400'
          }`}
          data-cy={message.type === 'success' ? 'success-message' : 'error-message'}
        >
          <div className="font-medium mb-1">{message.text}</div>
          {message.details && (
            <div className="text-xs opacity-75">{message.details}</div>
          )}
        </div>
      )}

      {/* Create Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCreateNotification} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="Ej: Nuevo producto agregado a nuestro almacén"
              required
              data-cy="notification-title-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensaje *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              rows={4}
              placeholder="Ej: Queremos que compres nuestro nuevo producto en Socomarca"
              required
              data-cy="notification-message-input"
            />
          </div>


          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || isRefreshingAfterCreate}
              className="bg-lime-500 text-white px-6 py-3 rounded-md hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              data-cy="create-notification-button"
            >
              {isCreating || isRefreshingAfterCreate ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
              {isCreating ? 'Enviando...' : isRefreshingAfterCreate ? 'Actualizando...' : 'Enviar Notificación'}
            </button>
          </div>
        </form>
      </div>

      {/* Historial de Notificaciones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-lime-600" />
                Historial de notificaciones
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {totalNotifications > 0 
                  ? `Total: ${totalNotifications} notificaciones | Página ${currentPage} de ${totalPages}`
                  : 'No hay notificaciones registradas'
                }
              </p>
            </div>
            <button
              onClick={handleRefreshTable}
              disabled={isLoadingNotifications || isRefreshingAfterCreate}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshingAfterCreate ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshingAfterCreate ? 'Recargando...' : 'Recargar'}
            </button>
          </div>
        </div>
        
        {isLoadingNotifications || isRefreshingAfterCreate ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mensaje</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha de envío</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {/* Skeleton rows */}
                {Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-28"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isRefreshingAfterCreate && (
              <div className="p-4 text-center border-t border-slate-200">
                <div className="inline-flex items-center gap-2 text-lime-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-600"></div>
                  Actualizando tabla...
                </div>
              </div>
            )}
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mensaje</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha de envío</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {notifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">#{notification.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{notification.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate" title={notification.message}>
                        {notification.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(notification.sent_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Mostrando {((currentPage - 1) * perPage) + 1} a {Math.min(currentPage * perPage, totalNotifications)} de {totalNotifications} notificaciones
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-lime-500 text-white border-lime-500'
                          : 'border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <BellIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No hay notificaciones registradas</p>
            <p className="text-sm mt-1">Las notificaciones que envíes aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}