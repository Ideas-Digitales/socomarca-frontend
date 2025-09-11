'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

export default function TokenDisplay() {
  const { token, notifications, dropdownNotifications, unreadCount, isSupported, requestPermission, addTestNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        🔧 Debug Notificaciones
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">Estado del Sistema</h3>
              <p className="text-sm text-gray-600">
                Soporte: {isSupported ? '✅ Soportado' : '❌ No soportado'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">FCM Token</h3>
              {token ? (
                <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                  {token}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No hay token disponible
                  <button
                    onClick={requestPermission}
                    className="ml-2 text-blue-600 underline"
                  >
                    Obtener Token
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">
                Banner ({notifications.length}) | Dropdown ({dropdownNotifications.length}) | No leídas: {unreadCount}
              </h3>
              <div className="text-xs text-gray-600 mb-2">
                Banner (auto-limpia) | Dropdown (persiste hasta abrir)
              </div>
              
              {dropdownNotifications.length === 0 ? (
                <p className="text-sm text-gray-500">No hay notificaciones en dropdown</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="text-xs font-medium text-blue-600">Notificaciones Dropdown:</div>
                  {dropdownNotifications.map((notif, index) => (
                    <div key={index} className="bg-blue-50 p-2 rounded text-xs border-l-2 border-blue-400">
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-gray-600">{notif.body}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                  <div className="text-xs font-medium text-green-600">Notificaciones Banner:</div>
                  {notifications.map((notif, index) => (
                    <div key={index} className="bg-green-50 p-1 rounded text-xs border-l-2 border-green-400">
                      <div className="font-medium">{notif.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t pt-2">
              <button
                onClick={addTestNotification}
                className="w-full bg-green-600 text-white text-xs px-3 py-2 rounded hover:bg-green-700 transition-colors mb-2"
              >
                🧪 Simular Notificación
              </button>
              <button
                onClick={() => {
                  console.log('🔍 Estado actual del hook:');
                  console.log('🔍 dropdownNotifications:', dropdownNotifications);
                  console.log('🔍 unreadCount:', unreadCount);
                  console.log('🔍 isSupported:', isSupported);
                  console.log('🔍 token:', token);
                }}
                className="w-full bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors mb-2"
              >
                🔍 Debug Estado
              </button>
              <div className="text-xs text-gray-400">
                💡 Revisa la consola del navegador para más detalles
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
