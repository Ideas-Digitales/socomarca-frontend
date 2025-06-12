'use client';

import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

interface Props {
  id: string;
  question: string;
  content: string;
  onChange: (data: { question?: string; content?: string }) => void;
}

export default function QuestionItem({ question, content, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const editorRef = useRef<any>(null);

  return (
    <div className="rounded border border-gray-100">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
      >
        <input
          value={question}
          onChange={(e) => onChange({ question: e.target.value })}
          className="text-sm font-medium w-full bg-transparent border-none focus:outline-none"
          placeholder="Escribe la pregunta aquí..."
        />
        <button type="button">
          {open ? (
            <MinusIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <PlusIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {open && (
        <div className="p-4 bg-white">
          <Editor
            apiKey="hcf5zec5hrqni246ht1fqdo73okwo1ky2bb5eklu89p0lp57"
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
             initialValue="Comienza a escribir tu respuesta aquí..."
          />
        </div>
      )}
    </div>
  );
}
