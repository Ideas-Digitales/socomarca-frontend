import { defineConfig } from "cypress";
import fs from 'fs';
import path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // Configurar directorio de descargas
      const downloadFolder = path.join(config.projectRoot, 'cypress/downloads');
      
      // Crear directorio de descargas si no existe
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
      }

      // Tarea para limpiar descargas
      on('task', {
        clearDownloads() {
          if (fs.existsSync(downloadFolder)) {
            const files = fs.readdirSync(downloadFolder);
            files.forEach(file => {
              fs.unlinkSync(path.join(downloadFolder, file));
            });
          }
          return null;
        },

        // Tarea para obtener el tamaño de un archivo
        getFileSize(filename: string) {
          const filePath = path.join(downloadFolder, filename);
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return stats.size;
          }
          return 0;
        },

        // Tarea para obtener la lista de archivos descargados
        getDownloadedFiles() {
          if (fs.existsSync(downloadFolder)) {
            return fs.readdirSync(downloadFolder);
          }
          return [];
        }
      });

      return config;
    },
    // Configuraciones adicionales para mejorar los tests
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    // Configuración para descargas
    downloadsFolder: 'cypress/downloads',
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
