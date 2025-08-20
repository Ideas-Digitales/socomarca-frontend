import { InputFile } from '@/interfaces/server-file.interface';

// Configuración para la sincronización de imágenes
export const SYNC_CONFIG = {
  // Endpoint de sincronización
  endpoint: '/products/images/sync',
  
  // Headers requeridos
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer {token}', // Placeholder para el token
  },
  
  // Configuración de archivos
  file: {
    maxSize: 150 * 1024 * 1024, // 150MB
    allowedTypes: ['application/zip', 'application/x-zip-compressed'],
    allowedExtensions: ['.zip'],
    // Nota: El ZIP debe contener archivo Excel (.xlsx) con 5 columnas y carpeta "images" con JPG/WEBP
  },
  
  // Configuración de retry
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },
  
  // Timeouts
  timeouts: {
    request: 30000, // 30 segundos
    response: 120000, // 2 minutos
  },
  
  // Códigos de error específicos
  errorCodes: {
    NOT_ACCEPTABLE: 406,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQUEST_TOO_LARGE: 413,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Mensajes de error
  errorMessages: {
    406: 'Error de formato: El servidor espera una respuesta JSON. Verifica que el archivo sea válido.',
    401: 'No autorizado: Token inválido o expirado',
    403: 'Acceso denegado: No tienes permisos para esta operación',
    404: 'Endpoint no encontrado: Verifica la URL del servidor',
    413: 'Archivo demasiado grande: El archivo excede el límite permitido',
    500: 'Error interno del servidor: Intenta nuevamente más tarde',
  },
};

// Función para validar archivo
export const validateFile = (file: InputFile): { isValid: boolean; error?: string } => {
  // Verificar que el archivo existe y tiene las propiedades necesarias
  if (!file || !file.size || file.size === 0) {
    return {
      isValid: false,
      error: 'El archivo está vacío o no se seleccionó correctamente'
    };
  }
  
  // Verificar tamaño
  if (file.size > SYNC_CONFIG.file.maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo permitido: ${SYNC_CONFIG.file.maxSize / (1024 * 1024)}MB`
    };
  }
  
  // Verificar tipo MIME
  const isValidMimeType = file.type && SYNC_CONFIG.file.allowedTypes.includes(file.type);
  const isValidExtension = file.name && SYNC_CONFIG.file.allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!isValidMimeType && !isValidExtension) {
    return {
      isValid: false,
      error: 'Formato de archivo inválido. Solo se permiten archivos ZIP'
    };
  }
  
  return { isValid: true };
};

// Función para obtener mensaje de error
export const getErrorMessage = (statusCode: number, customMessage?: string): string => {
  return customMessage || SYNC_CONFIG.errorMessages[statusCode as keyof typeof SYNC_CONFIG.errorMessages] || 
    `Error HTTP: ${statusCode}`;
};
