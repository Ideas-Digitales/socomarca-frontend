import { getPrivacyPolicy } from '../../../services/actions/privacy-policy.actions';

export default async function PoliticaPrivacidadPage() {
  const result = await getPrivacyPolicy();
  const content = result.success ? result.content : '';

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <div className="w-full flex shado max-w-4xl mx-auto">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow">

        {content ? (
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No hay contenido disponible en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
