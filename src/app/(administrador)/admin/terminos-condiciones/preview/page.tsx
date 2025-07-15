'use client';

import { useEffect, useState } from 'react';
import useStore from '@/stores/base';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';

export default function TerminosCondicionesPreviewPage() {
  const { 
    termsAndConditions,
    isLoadingTerms,
    fetchTermsAndConditions
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTerms = async () => {
      await fetchTermsAndConditions();
      setIsLoading(false);
    };
    loadTerms();
  }, [fetchTermsAndConditions]);

  if (isLoading || isLoadingTerms) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-white pt-0 shadow">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <LoadingSpinner />
            <p className="text-gray-600 text-sm">Cargando términos y condiciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white pt-0 shadow">
        <div className="w-full flex">
          <div className="h-2 w-1/3 bg-[#267E00]"></div>
          <div className="h-2 w-2/3 bg-[#6CB409]"></div>
        </div>
        <h1 className="text-3xl font-bold mb-8 pt-8 px-8">Términos y condiciones</h1>

        <div className="px-8 pb-8">
          {termsAndConditions?.content ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: termsAndConditions.content }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay contenido de términos y condiciones disponible.</p>
              <p className="text-gray-400 text-sm mt-2">Por favor, edita el contenido desde el panel de administración.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 