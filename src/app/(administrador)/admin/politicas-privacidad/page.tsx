'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useState } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

export default function RichTextEditor() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [customColor, setCustomColor] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
    ],
    content: '<p>Comienza a escribir tu contenido aquí...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const setTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Políticas de privacidad
        </h1>
        <p className="text-gray-600"></p>
      </div>

      {/* Barra de herramientas */}
      <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            title="Negrita"
          >
            <BoldIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="Cursiva"
          >
            <ItalicIcon className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Selector de color */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Color de texto"
            >
              <SwatchIcon className="w-5 h-5" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                {/* Color picker nativo */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar color personalizado:
                  </label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>

                {/* Colores predefinidos */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colores rápidos:
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      '#000000',
                      '#374151',
                      '#dc2626',
                      '#ea580c',
                      '#ca8a04',
                      '#16a34a',
                      '#0ea5e9',
                      '#7c3aed',
                      '#db2777',
                      '#84cc16',
                      '#06b6d4',
                      '#8b5cf6',
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={`Color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className="w-full text-xs py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Quitar color
                </button>
              </div>
            )}
          </div>

          {/* Botón de enlace */}
          <div className="relative">
            <button
              onClick={() => {
                if (editor.isActive('link')) {
                  removeLink();
                } else {
                  setShowLinkDialog(!showLinkDialog);
                }
              }}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive('link') ? 'bg-gray-300' : ''
              }`}
              title={
                editor.isActive('link') ? 'Quitar enlace' : 'Agregar enlace'
              }
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            {showLinkDialog && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 w-64">
                <input
                  type="url"
                  placeholder="https://ejemplo.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLink();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={addLink}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowLinkDialog(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run();
              }
            }}
            className="px-3 py-1 rounded border border-gray-300 text-sm"
            title="Encabezados"
          >
            <option value="0">Párrafo</option>
            <option value="1">Título 1</option>
            <option value="2">Título 2</option>
            <option value="3">Título 3</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Deshacer"
          >
            <ArrowUturnLeftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rehacer"
          >
            <ArrowUturnRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor de contenido */}
      <div className="border border-gray-200 border-t-0 rounded-b-lg">
        <EditorContent
          editor={editor}
          className="min-h-[400px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 rounded-b-lg"
        />
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-sm text-gray-500">
        <p className='hidden lg:block'>
          Utiliza las herramientas de la barra superior para dar formato a tu
          texto. También puedes usar atajos de teclado como{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> para
          negrita,
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> para
          cursiva, etc.
        </p>
      </div>
    </div>
  );
}
