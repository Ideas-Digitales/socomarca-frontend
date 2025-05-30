'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import QuestionItem from './QuestionItem'

interface Question {
  id: string
  question: string
  content?: string
}

export default function FaqEditor() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      question: '¿Cuál es el valor por envío?',
      content: '<p>Lorem ipsum dolor sit amet...</p>',
    },
  ])

  const updateQuestion = (id: string, newData: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newData } : q)),
    )
  }

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        question: '',
        content: '<p>Escribe la respuesta aquí...</p>',
      },
    ])
  }

  const handleSave = () => {
    const payload = questions.map((q) => ({
      question: q.question,
      answer: q.content,
    }))
    console.log(payload)
    alert('Contenido guardado (ver consola)')
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Preguntas frecuentes</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded text-sm">Desactivar página</button>
          <button onClick={handleSave} className="px-4 py-2 bg-lime-500 text-white rounded text-sm">
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q: Question) => (
          <QuestionItem
            key={q.id}
            id={q.id}
            question={q.question}
            content={q.content || ''}
            onChange={(data: Partial<Question>) => updateQuestion(q.id, data)}
          />
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="px-4 py-2 border border-slate-300 text-sm rounded hover:bg-slate-50"
      >
        Agregar nueva pregunta
      </button> 
    </div>
  )
}
