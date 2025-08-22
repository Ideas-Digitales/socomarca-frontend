// Configuración del servidor para archivos grandes
const serverConfig = {
  // Límites de tamaño para archivos
  maxFileSize: 150 * 1024 * 1024, // 150MB en bytes
  maxFileSizeMB: 150,
  
  // Configuración de Node.js
  nodeOptions: {
    maxOldSpaceSize: 4096, // 4GB
    maxHttpHeaderSize: 81920, // 80KB
  },
  
  // Configuración de Next.js
  nextConfig: {
    bodySizeLimit: '150mb',
    maxFileSize: '150mb',
  },
  
  // Configuración de Express (si se usa)
  expressConfig: {
    limit: '150mb',
    extended: true,
  },
  
  // Configuración de multer (si se usa)
  multerConfig: {
    limits: {
      fileSize: 150 * 1024 * 1024, // 150MB
      files: 1, // Solo un archivo a la vez
    },
  },
  
  // Configuración de CORS
  corsConfig: {
    origin: true,
    credentials: true,
    maxFileSize: '150mb',
  },
};

module.exports = serverConfig;
