'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';

export default function RichTextEditor() {

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
         initialValue="Comienza a escribir tu contenido aquí..."
      />

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
