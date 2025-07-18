'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';
import { savePrivacyPolicy, getPrivacyPolicy } from '../../../../services/actions/privacy-policy.actions';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function RichTextEditor() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        const result = await getPrivacyPolicy();
        if (result.success) {
          setContent(result.content || 'Comienza a escribir tu contenido aquí...');
        } else {
          setContent('Comienza a escribir tu contenido aquí...');
        }
      } catch (error) {
        console.error('Error loading privacy policy:', error);
        setContent('Comienza a escribir tu contenido aquí...');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  const handleEditorChange = (content: string) => {
    setContent(content);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Por favor, ingresa contenido antes de guardar.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const result = await savePrivacyPolicy(content);

      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(result.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando editor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen" dir="ltr">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Políticas de privacidad</h1>
      </div>

      {/* Editor */}
      <Editor
        apiKey="hcf5zec5hrqni246ht1fqdo73okwo1ky2bb5eklu89p0lp57"
        init={{
          height: 500,
          menubar: false,
          language: 'es',
          directionality: 'ltr',
          body_class: 'editor-ltr',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'anchor',
            'insertdatetime', 'table', 'help', 'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | link | help',
          content_style: `
            body.editor-ltr {
              direction: ltr !important;
              text-align: left !important;
              font-family:Helvetica,Arial,sans-serif;
              font-size:14px;
            }
          `,
          
        }}
        value={content}
        onEditorChange={handleEditorChange}
      />

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-4">
        {/* Botón Ver en el sitio */}
        <button
          onClick={() => window.location.href = '/politica-de-privacidad'}
          className="px-6 py-2 rounded-md font-medium transition-colors bg-lime-500 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <EyeIcon className="w-5 h-5" />
          Ver en ellimeio
        </button>
        {/* Botón Guardar cambios */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-lime-500 hover:bg-lime-600 text-white'
          }`}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Políticas de privacidad guardadas exitosamente
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ Error al guardar las políticas de privacidad
        </div>
      )}

      {/* Info */}
      <div className="mt-4 text-sm text-gray-500">
        <p className="hidden lg:block">
          Utiliza las herramientas del editor para dar formato a tu texto. También puedes usar atajos como{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> para negrita y{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> para cursiva.
        </p>
      </div>
    </div>
  );
}
