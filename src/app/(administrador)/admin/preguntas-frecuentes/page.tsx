'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import QuestionItem from './QuestionItem';
import Modal from '@/app/components/global/Modal';
import useStore from '@/stores/base';

interface Question {
  id: number;
  question: string;
  content?: string;
}

export default function FaqEditor() {
  const { 
    faqs, 
    isLoadingFAQ, 
    faqError, 
    fetchFAQs, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ,
    clearFAQError,
    openModal,
    closeModal
  } = useStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState<Map<number, Partial<Question>>>(new Map());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });

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
        className="w-full px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors cursor-pointer"
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
        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
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
        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
      >
        Aceptar
      </button>
    </div>
  );

  useEffect(() => {
    // Cargar FAQs al montar el componente
    fetchFAQs();
  }, [fetchFAQs]);

  useEffect(() => {
    // Convertir FAQs del store a formato local
    const convertedFAQs = faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      content: faq.answer,
    }));
    setQuestions(convertedFAQs);
  }, [faqs]);

  const updateQuestion = (id: number, newData: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newData } : q))
    );
    
    // Marcar como cambio no guardado
    setUnsavedChanges(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { ...newMap.get(id), ...newData });
      return newMap;
    });
  };

  const startAddingQuestion = () => {
    setIsAddingNew(true);
    setNewQuestion({ question: '', answer: '' });
  };

  const cancelAddingQuestion = () => {
    setIsAddingNew(false);
    setNewQuestion({ question: '', answer: '' });
  };

  const saveNewQuestion = async () => {
    if (!newQuestion.question.trim()) {
      openModal('', {
        title: 'Validación',
        size: 'sm',
        content: <WarningModal message="Por favor, ingresa una pregunta antes de guardar." onClose={closeModal} />
      });
      return;
    }

    try {
      const answerContent = newQuestion.answer.trim() || '<p>Respuesta pendiente...</p>';
      const result = await createFAQ(newQuestion.question, answerContent);
      if (result.success) {
        setIsAddingNew(false);
        setNewQuestion({ question: '', answer: '' });
        openModal('', {
          title: '',
          size: 'sm',
          content: <SuccessModal message="La pregunta ha sido creada exitosamente." onClose={closeModal} />
        });
      } else {
        console.error('Error al crear FAQ:', result.error);
        openModal('', {
          title: '',
          size: 'sm',
          content: <ErrorModal message="Error al crear la pregunta. Por favor, intenta de nuevo." onClose={closeModal} />
        });
      }
    } catch (error) {
      console.error('Error al crear FAQ:', error);
      openModal('', {
        title: '',
        size: 'sm',
        content: <ErrorModal message="Error al crear la pregunta. Por favor, intenta de nuevo." onClose={closeModal} />
      });
    }
  };

  const handleSave = async () => {
    try {
      const promises = Array.from(unsavedChanges.entries()).map(([id, changes]) => {
        return updateFAQ(id, changes.question, changes.content);
      });
      
      const results = await Promise.all(promises);
      const hasErrors = results.some(result => !result.success);
      
      if (hasErrors) {
        openModal('', {
          title: '',
          size: 'sm',
          content: <WarningModal message="Algunos cambios no se pudieron guardar. Ver consola para más detalles." onClose={closeModal} />
        });
      } else {
        setUnsavedChanges(new Map());
        openModal('', {
          title: '',
          size: 'sm',
          content: <SuccessModal message="Cambios guardados exitosamente" onClose={closeModal} />
        });
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      openModal('', {
        title: '',
        size: 'sm',
        content: <ErrorModal message="Error al guardar cambios" onClose={closeModal} />
      });
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    openModal('', {
      title: 'Confirmar eliminación',
      size: 'sm',
      content: (
        <div className="space-y-4">
          <p>¿Estás seguro de que quieres eliminar esta pregunta?</p>
          <p className="text-sm text-gray-600">Esta acción no se puede deshacer.</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={async () => {
                try {
                  const result = await deleteFAQ(id);
                  if (result.success) {
                    closeModal();
                    openModal('', {
                      title: '',
                      size: 'sm',
                      content: <SuccessModal message="La pregunta ha sido eliminada exitosamente." onClose={closeModal} />
                    });
                  } else {
                    console.error('Error al eliminar FAQ:', result.error);
                    closeModal();
                    openModal('', {
                      title: '',
                      size: 'sm',
                      content: <ErrorModal message="Error al eliminar la pregunta. Por favor, intenta de nuevo." onClose={closeModal} />
                    });
                  }
                } catch (error) {
                  console.error('Error al eliminar FAQ:', error);
                  closeModal();
                  openModal('', {
                    title: '',
                    size: 'sm',
                    content: <ErrorModal message="Error al eliminar la pregunta. Por favor, intenta de nuevo." onClose={closeModal} />
                  });
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )
    });
  };

  if (isLoadingFAQ && questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center">
          <p>Cargando preguntas frecuentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Preguntas frecuentes
        </h1>
        <div className="flex gap-4 flex-col py-4 w-full sm:w-auto sm:flex-row">
          {/*<button className="px-4 py-2 border rounded text-sm w-full">
            Desactivar página
          </button>*/}
          <button
            onClick={handleSave}
            disabled={isLoadingFAQ || unsavedChanges.size === 0}
            className={`px-4 py-2 text-white rounded text-sm transition-all duration-300 ${
              isLoadingFAQ || unsavedChanges.size === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600 cursor-pointer'
            }`}
          >
            {isLoadingFAQ ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {faqError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {faqError}</p>
          <button
            onClick={clearFAQError}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q: Question) => (
          <QuestionItem
            key={q.id}
            id={q.id.toString()}
            question={q.question}
            content={q.content || ''}
            onChange={(data: Partial<Question>) => updateQuestion(q.id, data)}
            onDelete={() => handleDeleteQuestion(q.id)}
          />
        ))}
        
        {/* Formulario para nueva pregunta */}
        {isAddingNew && (
          <div className="rounded border border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-800">Nueva pregunta</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pregunta
                  </label>
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Escribe la pregunta aquí..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Respuesta
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    <Editor
                      apiKey="hcf5zec5hrqni246ht1fqdo73okwo1ky2bb5eklu89p0lp57"
                      value={newQuestion.answer}
                      onEditorChange={(content: string) => setNewQuestion(prev => ({ ...prev, answer: content }))}
                      init={{
                        height: 150,
                        menubar: false,
                        language: 'es',
                        directionality: 'ltr',
                        body_class: 'editor-ltr',
                        placeholder: 'Escribe la respuesta aquí...',
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
                          body[data-mce-placeholder]:not([data-mce-placeholder=""]):before {
                            color: #999;
                            font-style: italic;
                          }
                        `,
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveNewQuestion}
                  disabled={isLoadingFAQ || !newQuestion.question.trim()}
                  className={`px-4 py-2 text-sm rounded transition-all duration-300 ${
                    isLoadingFAQ || !newQuestion.question.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-lime-500 text-white hover:bg-lime-600 cursor-pointer'
                  }`}
                >
                  {isLoadingFAQ ? 'Guardando...' : 'Guardar pregunta'}
                </button>
                <button
                  onClick={cancelAddingQuestion}
                  disabled={isLoadingFAQ}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isAddingNew && (
        <button
          onClick={startAddingQuestion}
          disabled={isLoadingFAQ}
          className={`px-4 py-2 border border-slate-300 text-sm rounded transition-all duration-300 ${
            isLoadingFAQ
              ? 'bg-gray-100 cursor-not-allowed'
              : 'hover:bg-slate-50 cursor-pointer'
          }`}
        >
          + Agregar nueva pregunta
        </button>
      )}
      
      <Modal />
    </div>
  );
}
