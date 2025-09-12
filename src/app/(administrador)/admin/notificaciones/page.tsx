'use client';

import { useState } from 'react';
import { 
  BellIcon, 
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { fetchCreateNotification } from '@/services/actions/notifications.actions';

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
              disabled={isCreating}
              className="bg-lime-500 text-white px-6 py-3 rounded-md hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              data-cy="create-notification-button"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              {isCreating ? 'Enviando...' : 'Enviar Notificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 