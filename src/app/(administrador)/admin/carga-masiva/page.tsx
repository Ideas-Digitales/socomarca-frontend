'use client';

import { useState, useEffect } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { syncProductImages } from '@/services/actions/products.actions';
import { hasPermission } from '@/configs/permisos';
import useAuthStore from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function CargaMasivaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  const { getUserPermissions } = useAuthStore();
  const router = useRouter();

  // Verificar permisos al cargar el componente
  useEffect(() => {
    const checkPermissions = () => {
      try {
        const userPermissions = getUserPermissions();
        const canSyncImages = hasPermission(userPermissions, 'sync-product-images');
        
        if (!canSyncImages) {
          router.push('/acceso-denegado');
          return;
        }
        
        setHasAccess(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking permissions:', error);
        // Si hay error, redirigir a acceso denegado
        router.push('/acceso-denegado');
      }
    };

    checkPermissions();
  }, [getUserPermissions, router]);

  // Mostrar loading mientras se verifican los permisos
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no tiene acceso (será redirigido)
  if (!hasAccess) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validar que sea un archivo ZIP
      if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setUploadStatus('idle');
        setMessage('');
      } else {
        setMessage('Por favor, selecciona un archivo ZIP válido.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, selecciona un archivo para subir.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const result = await syncProductImages(file);
      
      if (result.success) {
        setUploadStatus('success');
        setMessage('Archivo subido exitosamente. Las imágenes se están procesando.');
        setFile(null);
        // Limpiar el input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus('error');
        setMessage(result.message || 'Error al subir el archivo.');
      }
    } catch (error: any) {
      setUploadStatus('error');
      
      let errorMessage = 'Error inesperado al subir el archivo.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carga Masiva de Imágenes
          </h1>
          <p className="text-gray-600">
            Sube un archivo ZIP que contenga un archivo Excel con la información de productos y una carpeta &quot;images&quot; con las imágenes correspondientes.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
                         {/* File Input */}
             <div>
               <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                 Seleccionar archivo ZIP (con Excel + carpeta images)
               </label>
               <div className="mt-1">
                 <input
                   id="file-input"
                   name="file-input"
                   type="file"
                   accept=".zip"
                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 file:cursor-pointer"
                   onChange={handleFileChange}
                   disabled={isUploading}
                 />
               </div>
             </div>



            {/* File Preview */}
            {file && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <DocumentArrowUpIcon className="h-8 w-8 text-lime-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setMessage('');
                      setUploadStatus('idle');
                      const fileInput = document.getElementById('file-input') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isUploading}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !file || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500'
                } transition-colors duration-200`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Subir y Sincronizar'
                )}
              </button>
            </div>

                         {/* Status Message */}
             {message && (
               <div className={`text-sm ${getStatusColor()}`}>
                 {message}
               </div>
             )}

             
          </div>
        </div>

                 {/* Instructions */}
         <div className="mt-8 bg-blue-50 rounded-lg p-6">
           <h3 className="text-lg font-medium text-blue-900 mb-3">
             Instrucciones para la carga masiva
           </h3>
           <ul className="space-y-2 text-sm text-blue-800">
             <li className="flex items-start">
               <span className="text-blue-600 mr-2">•</span>
               El archivo debe estar en formato ZIP
             </li>
             <li className="flex items-start">
               <span className="text-blue-600 mr-2">•</span>
               El ZIP debe contener un archivo Excel (.xlsx) y una carpeta llamada &quot;images&quot;
             </li>
                           <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                El archivo Excel debe tener las columnas: SKU, Nombre, Categoría, Subcategoria, Imágenes
              </li>
             <li className="flex items-start">
               <span className="text-blue-600 mr-2">•</span>
               Las imágenes deben estar en la carpeta &quot;images&quot; con formatos: JPG y WEBP
             </li>
             <li className="flex items-start">
               <span className="text-blue-600 mr-2">•</span>
               El proceso puede tomar varios minutos dependiendo del tamaño del archivo
             </li>
             <li className="flex items-start">
               <span className="text-blue-600 mr-2">•</span>
               Si hay errores, usa la información de debug para diagnosticar problemas
             </li>
           </ul>
           
           {/* Estructura del ZIP */}
           <div className="mt-4 p-4 bg-blue-100 rounded-lg">
             <h4 className="text-sm font-medium text-blue-900 mb-2">Estructura del archivo ZIP:</h4>
             <div className="text-xs text-blue-800 font-mono">
               <div>📁 archivo.zip</div>
               <div className="ml-4">📄 archivo.xlsx</div>
               <div className="ml-4">📁 images/</div>
               <div className="ml-8">🖼️ imagen1.jpg</div>
               <div className="ml-8">🖼️ imagen2.webp</div>
               <div className="ml-8">🖼️ imagen3.jpg</div>
             </div>
           </div>
           
                       {/* Columnas del Excel */}
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Columnas requeridas en el Excel:</h4>
              <div className="text-xs text-blue-800 font-mono">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-blue-200 p-1 rounded">SKU</div>
                  <div className="bg-blue-200 p-1 rounded">Nombre</div>
                  <div className="bg-blue-200 p-1 rounded">Categoría</div>
                  <div className="bg-blue-200 p-1 rounded">Subcategoria</div>
                  <div className="bg-blue-200 p-1 rounded">Imágenes</div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
