'use client'

import { useState } from 'react'
import {
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline'

const faqs = [
  '¿Cuál es el valor por envío?',
  '¿Cuánto es el monto mínimo de una compra?',
  '¿Cuáles son los medios de pagos?',
  '¿Cómo hago un pedido en socomarca.cl?',
  '¿Cómo puedo realizar cambios y evoluciones?',
  '¿Qué opciones de envío están disponibles en socomarca.cl?',
  '¿Cuánto tiempo tarda en enviarse un pedido?',
  'Mi producto está presentando fallas, ¿cuál es el procedimiento para acreditarla?',
  '¿Cuáles son los plazos de entrega?',
]

export default function PreguntasFrecuentes() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggleIndex = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className='bg-white max-w-7xl mx-auto mt-8 mb-8'>
      <div className="w-full flex">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-12 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Preguntas frecuentes
        </h2>
        <ul className="divide-y divide-slate-200 rounded-lg overflow-hidden bg-white">
          {faqs.map((question, i) => {
            const isOpen = activeIndex === i
            return (
              <li key={i}>
                <button
                  onClick={() => toggleIndex(i)}
                  className={`w-full flex items-center justify-between text-left px-4 py-5 focus:outline-none transition ${
                    isOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isOpen ? 'text-lime-600' : 'text-slate-900'
                    }`}
                  >
                    {question}
                  </span>
                  {isOpen ? (
                    <MinusIcon className="h-5 w-5 text-slate-600" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
                {isOpen && (
                  <div className="bg-slate-100 px-4 pb-5 text-sm text-slate-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Donec quam felis, ultricies nec,
                    pellentesque eu, pretium quis, sem.
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
