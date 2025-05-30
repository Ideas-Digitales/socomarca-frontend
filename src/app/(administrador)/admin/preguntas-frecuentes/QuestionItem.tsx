'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'

interface Props {
  id: string
  question: string
  content: string
  onChange: (data: { question?: string; content?: string }) => void
}

export default function QuestionItem({ id, question, content, onChange }: Props) {
  const [open, setOpen] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Link],
    content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none border !border-gray-50 min-h-[120px] focus:outline-none bg-white rounded-md p-4',
      },
    },
    onUpdate({ editor }) {
      onChange({ content: editor.getHTML() })
    },
  })

  return (
    <div className=" rounded">
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
        <button>
          {open ? (
            <MinusIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <PlusIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
      {open && editor && <EditorContent editor={editor} />}
    </div>
  )
}
