import { getPrivacyPolicy } from '../../../services/actions/privacy-policy.actions';

export default async function PoliticaPrivacidadPage() {
  const result = await getPrivacyPolicy();
  const content = result.success ? result.content : '';

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <div className="w-full flex px-2 shado">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-8">Política y privacidad</h1>

        {content ? (
          <div 
            className="prose max-w-none"
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
