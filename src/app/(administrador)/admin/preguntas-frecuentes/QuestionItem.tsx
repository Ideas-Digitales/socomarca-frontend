'use client';

import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Props {
  id: string;
  question: string;
  content: string;
  onChange: (data: { question?: string; content?: string }) => void;
  onDelete?: () => void;
}

export default function QuestionItem({ question, content, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded border border-gray-100">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100">
        <div className="flex-1 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setOpen(!open)}
            className="flex-shrink-0"
          >
            {open ? (
              <MinusIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <PlusIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <input
            value={question}
            onChange={(e) => onChange({ question: e.target.value })}
            className="text-sm font-medium w-full bg-transparent border-none focus:outline-none"
            placeholder="Escribe la pregunta aquí..."
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Eliminar pregunta"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="p-4 bg-white">
          <Editor
            apiKey="hcf5zec5hrqni246ht1fqdo73okwo1ky2bb5eklu89p0lp57"
            value={content}
            onEditorChange={(content) => onChange({ content })}
            init={{
              height: 200,
              menubar: false,
              language: 'es',
              directionality: 'ltr',
              body_class: 'editor-ltr',
              plugins: [
                'link', 'lists', 'advlist', 'autolink', 'charmap',
                'anchor', 'insertdatetime', 'table', 'wordcount', 'help'
              ],
              toolbar:
                'undo redo | blocks | bold italic underline forecolor | ' +
                'alignleft aligncenter alignright alignjustify | bullist numlist | link | removeformat',
              content_style: `
                body.editor-ltr {
                  direction: ltr;
                  font-family: Helvetica, Arial, sans-serif;
                  font-size: 14px;
                }
              `,
            }}
          />
        </div>
      )}
    </div>
  );
}
