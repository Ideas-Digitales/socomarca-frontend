import { getPrivacyPolicy } from '../../../services/actions/privacy-policy.actions';
import useAuthStore from '@/stores/useAuthStore';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default async function PoliticaPrivacidadPage() {
  const result = await getPrivacyPolicy();
  const content = result.success ? result.content : '';
  
  const AdminButton = () => {
    const { getUserRole } = useAuthStore();
    const userRole = getUserRole();
    if (userRole !== 'admin' && userRole !== 'superadmin') return null;
    return (
      <a
        href={userRole === 'admin' ? '/admin/total-de-ventas' : '/super-admin/users'}
        className="fixed z-50 bottom-6 right-6 flex items-center gap-2 bg-[#007f00] hover:bg-[#003200] text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg transition-colors duration-200"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
      >
        <ArrowUturnLeftIcon className="w-6 h-6" />
        Volver al panel de administración
      </a>
    );
  };
  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <AdminButton />
      <div className="w-full flex shado max-w-4xl mx-auto">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow">
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
