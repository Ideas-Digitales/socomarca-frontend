'use client';

import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface FCMTokenInfoProps {
  className?: string;
}

export default function FCMTokenInfo({ className = '' }: FCMTokenInfoProps) {
  const [showToken, setShowToken] = useState(false);
  const { 
    token, 
    tokenSentToServer, 
    tokenError, 
    isSupported, 
    requestPermission 
  } = useNotifications();

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Estado FCM Token
      </h3>
      
      <div className="space-y-3">
        {/* Soporte */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Soporte FCM:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isSupported 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isSupported ? 'Soportado' : 'No soportado'}
          </span>
        </div>

        {/* Token */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Token:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            token 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {token ? 'Obtenido' : 'No disponible'}
          </span>
        </div>

        {/* Estado del envío */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Enviado al servidor:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            tokenSentToServer 
              ? 'bg-green-100 text-green-800' 
              : token 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {tokenSentToServer ? 'Enviado' : token ? 'Pendiente' : 'No disponible'}
          </span>
        </div>

        {/* Error */}
        {tokenError && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <span className="font-medium text-red-800">Error:</span>
            <p className="text-red-700 text-sm mt-1">{tokenError}</p>
          </div>
        )}

        {/* Token completo */}
        {token && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Token completo:</span>
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {showToken && (
              <div className="bg-gray-50 rounded p-3 text-xs font-mono break-all">
                {token}
              </div>
            )}
          </div>
        )}

        {/* Botón de acción */}
        <div className="border-t pt-3">
          {!token ? (
            <button
              onClick={handleRequestPermission}
              disabled={!isSupported}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isSupported ? 'Obtener Token FCM' : 'FCM No Soportado'}
            </button>
          ) : !tokenSentToServer ? (
            <button
              onClick={handleRequestPermission}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 text-sm font-medium"
            >
              Reintentar Envío
            </button>
          ) : (
            <div className="text-center text-green-600 text-sm font-medium">
              ✅ Token FCM configurado correctamente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
