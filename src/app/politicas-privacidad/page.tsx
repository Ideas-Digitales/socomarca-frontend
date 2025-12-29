import { getPrivacyPolicyPublic } from '@/services/actions/privacy-policy.actions';
import Link from 'next/link';

export default async function PoliticasPrivacidadPublicPage() {
  const result = await getPrivacyPolicyPublic();
  const content = result.success ? result.content : '';

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <div className="w-full flex shado max-w-4xl mx-auto">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow">
        {content && content !== 'No hay contenido disponible en este momento.' ? (
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Política de Privacidad</h2>
              <p className="mb-4">Para ver nuestra política de privacidad, por favor inicia sesión.</p>
            </div>
            <Link 
              href="/auth/login"
              className="inline-block px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
