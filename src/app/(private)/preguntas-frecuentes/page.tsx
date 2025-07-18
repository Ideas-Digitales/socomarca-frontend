'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline'
import useStore from '@/stores/base'
import useAuthStore from '@/stores/useAuthStore';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function PreguntasFrecuentes() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const { getUserRole } = useAuthStore();
  const userRole = getUserRole();
  
  const {
    faqs,
    isLoadingFAQ,
    faqError,
    fetchFAQs
  } = useStore()

  useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  console.log(faqs)

  const toggleIndex = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  if (isLoadingFAQ) {
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Cargando preguntas frecuentes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (faqError) {
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
          <div className="text-center py-8">
            <p className="text-red-600">Error al cargar las preguntas frecuentes: {faqError}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!faqs || faqs.length === 0) {
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
          <div className="text-center py-8">
            <p className="text-slate-600">No hay preguntas frecuentes disponibles.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white max-w-7xl mx-auto mt-8 mb-8'>
      {(userRole === 'admin' || userRole === 'superadmin') && (
        <a
          href={userRole === 'admin' ? '/admin/total-de-ventas' : '/super-admin/users'}
          className="fixed z-50 bottom-6 right-6 flex items-center gap-2 bg-[#007f00] hover:bg-[#003200] text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg transition-colors duration-200"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          <ArrowUturnLeftIcon className="w-6 h-6" />
          Volver al panel de administración
        </a>
      )}
      <div className="w-full flex">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-12 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Preguntas frecuentes
        </h2>
        <ul className="divide-y divide-slate-200 rounded-lg overflow-hidden bg-white">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i
            return (
              <li key={faq.id}>
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
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <MinusIcon className="h-5 w-5 text-slate-600" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
                {isOpen && (
                  <div 
                    className="bg-slate-100 px-4 pb-5 text-sm text-slate-700"
                    dangerouslySetInnerHTML={{ 
                      __html: faq.answer 
                        .replace(/&aacute;/g, 'á')
                        .replace(/&eacute;/g, 'é')
                        .replace(/&iacute;/g, 'í')
                        .replace(/&oacute;/g, 'ó')
                        .replace(/&uacute;/g, 'ú')
                        .replace(/&ntilde;/g, 'ñ')
                        .replace(/&Aacute;/g, 'Á')
                        .replace(/&Eacute;/g, 'É')
                        .replace(/&Iacute;/g, 'Í')
                        .replace(/&Oacute;/g, 'Ó')
                        .replace(/&Uacute;/g, 'Ú')
                        .replace(/&Ntilde;/g, 'Ñ')
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                    }}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
