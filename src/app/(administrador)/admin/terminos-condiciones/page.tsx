'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/solid';
import Modal from '@/app/components/global/Modal';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import useStore from '@/stores/base';

export default function RichTextEditor() {
  const { 
    termsAndConditions,
    isLoadingTerms,
    isUpdatingTerms,
    termsError,
    hasUnsavedChanges,
    fetchTermsAndConditions,
    updateTermsAndConditions,
    setCurrentContent,
    clearTermsError,
    openModal,
    closeModal
  } = useStore();

  const [editorContent, setEditorContent] = useState('');

  // Componentes de modal mejorados
  const SuccessModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircleIcon className="w-16 h-16 text-lime-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">¡Éxito!</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md transition-colors cursor-pointer"
      >
        Aceptar
      </button>
    </div>
  );

  const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <XCircleIcon className="w-16 h-16 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Error</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors cursor-pointer"
      >
        Aceptar
      </button>
    </div>
  );

  const WarningModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Advertencia</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors cursor-pointer"
      >
        Aceptar
      </button>
    </div>
  );



  useEffect(() => {
    // Cargar términos y condiciones al montar el componente
    fetchTermsAndConditions();
  }, [fetchTermsAndConditions]);

  useEffect(() => {
    // Actualizar el contenido del editor cuando se cargan los datos
    if (termsAndConditions?.content) {
      setEditorContent(termsAndConditions.content);
      setCurrentContent(termsAndConditions.content);
    }
  }, [termsAndConditions, setCurrentContent]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setCurrentContent(content);
  };

  const handleSave = async () => {
    if (!editorContent.trim()) {
      openModal('', {
        title: 'Validación',
        size: 'sm',
        content: <WarningModal message="Por favor, ingresa contenido antes de guardar." onClose={closeModal} />
      });
      return;
    }

    try {
      const result = await updateTermsAndConditions(editorContent);
      if (result.ok) {
        openModal('', {
          title: '',
          size: 'sm',
          content: <SuccessModal message="Los términos y condiciones han sido actualizados exitosamente." onClose={closeModal} />
        });
      } else {
        console.error('Error al actualizar términos y condiciones:', result.error);
        openModal('', {
          title: '',
          size: 'sm',
          content: <ErrorModal message="Error al actualizar los términos y condiciones. Por favor, intenta de nuevo." onClose={closeModal} />
        });
      }
    } catch (error) {
      console.error('Error al actualizar términos y condiciones:', error);
      openModal('', {
        title: '',
        size: 'sm',
        content: <ErrorModal message="Error al actualizar los términos y condiciones. Por favor, intenta de nuevo." onClose={closeModal} />
      });
    }
  };

  const handlePreview = () => {
    // Abrir la página de vista previa de términos y condiciones en una nueva ventana
    window.open('/admin/terminos-condiciones/preview', '_blank');
  };

  if (isLoadingTerms && !termsAndConditions) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <LoadingSpinner />
          <p className="text-gray-600 text-sm">Cargando términos y condiciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Términos y condiciones</h1>
        <p className="text-gray-600">Edita el contenido de los términos y condiciones usando el editor de texto enriquecido.</p>
      </div>

      {termsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {termsError}</p>
          <button
            onClick={clearTermsError}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Editor TinyMCE */}
      <div className="mb-6">
        <Editor
          apiKey="hcf5zec5hrqni246ht1fqdo73okwo1ky2bb5eklu89p0lp57"
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: false,
            language: 'es',
            directionality: 'ltr',
            body_class: 'editor-ltr',
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap', 'anchor',
              'insertdatetime', 'table', 'wordcount', 'help',
            ],
            toolbar:
              'undo redo | blocks | bold italic underline forecolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | link removeformat | help',
            content_style: `
              body.editor-ltr {
                direction: ltr !important;
                text-align: left !important;
                font-family: Helvetica, Arial, sans-serif;
                font-size: 14px;
              }
            `,
          }}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePreview}
          disabled={!editorContent.trim()}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-2 ${
            !editorContent.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-lime-500 hover:bg-lime-600 text-white cursor-pointer'
          }`}
        >
          <EyeIcon className="w-4 h-4" />
          Visualizar
        </button>
        
        <button
          onClick={handleSave}
          disabled={isUpdatingTerms || !hasUnsavedChanges}
          className={`px-6 py-3 text-white rounded-md text-sm font-medium transition-all duration-300 ${
            isUpdatingTerms || !hasUnsavedChanges
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-lime-500 hover:bg-lime-600 cursor-pointer'
          }`}
        >
          {isUpdatingTerms ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Guardando...
            </div>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-sm text-gray-500">
        <p className="hidden lg:block">
          Utiliza las herramientas del editor para dar formato a tu texto. También puedes usar atajos como{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> para negrita y{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> para cursiva.
        </p>
      </div>
      
      <Modal />
    </div>
  );
}
