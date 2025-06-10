import { SidebarConfig } from '@/interfaces/sidebar.interface';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Función para crear el modal de logout que acepta las funciones como parámetros
export const createLogoutModal = (
  onLogout: () => void,
  onCancel: () => void
) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
      <div className="flex items-start gap-2 mb-4">
        <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500 mt-1" />
        <div>
          <h2 className="text-lg font-bold">¿Deseas cerrar sesión?</h2>
          <p className="text-sm text-gray-600">
            Se perderán los datos no guardados.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onLogout}
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
        >
          Continuar
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

// Función que retorna la configuración del sidebar admin
export const getAdminDashboardConfig = (
  openModal: (id: string, config: any) => void,
  closeModal: () => void,
  router: { push: (url: string) => void }
): SidebarConfig => {
  const handleLogout = () => {
    closeModal();
    router.push('/login');
  };

  return {
    items: [
      {
        id: 'sales-report',
        label: 'Reporte de ventas',
        submenu: [
          { name: 'Total de ventas', url: '/admin/total-de-ventas' },
          {
            name: 'Transacciones exitosas',
            url: '/admin/transacciones-exitosas',
          },
          { name: 'Cliente con más compra', url: '/admin/clientes-mas-compra' },
          {
            name: 'Productos con más ventas',
            url: '/admin/productos-mas-ventas',
          },
          { name: 'Comunas con más ventas', url: '/admin/comunas-mas-ventas' },
          {
            name: 'Categoría con más ventas',
            url: '/admin/categoria-mas-ventas',
          },
          {
            name: 'Transacciones fallidas o canceladas',
            url: '/admin/transacciones-fallidas',
          },
        ],
      },
      {
        id: 'productos',
        label: 'Productos',
        url: '/admin/productos',
      },
      {
        id: 'categorias',
        label: 'Categorías',
        url: '/admin/categorias',
      },
      {
        id: 'clientes',
        label: 'Clientes',
        url: '/admin/clientes',
      },
      {
        id: 'info-sitio',
        label: 'Información del sitio',
        url: '/admin/informacion-sitio',
      },
      {
        id: 'terminos',
        label: 'Términos y condiciones',
        url: '/admin/terminos-condiciones',
      },
      {
        id: 'politicas',
        label: 'Políticas y privacidad',
        url: '/admin/politicas-privacidad',
      },
      {
        id: 'faq',
        label: 'Preguntas frecuentes',
        url: '/admin/preguntas-frecuentes',
      },
      {
        id: 'mensaje-cliente',
        label: 'Mensaje para el cliente',
        url: '/admin/mensaje-cliente',
      },
      {
        id: 'Regiones y comunas',
        label: 'Regiones y comunas',
        url: '/admin/regiones',
      },
      {
        id: 'Transbank',
        label: 'Transbank',
        url: '/admin/transbank',
      },
      {
        id: 'users',
        label: 'Usuarios',
        url: '/users',
      },
      {
        id: 'create-user',
        label: 'Crear nuevo usuario',
        url: '/create-user',
      },
      {
        id: 'cerrar-sesion',
        label: 'Cerrar sesión',
        onClick: () => {
          openModal('logout', {
            title: 'Cerrar sesión',
            size: 'md',
            content: createLogoutModal(handleLogout, closeModal),
          });
        },
      },
    ],
  };
};

// Función que retorna la configuración del sidebar super admin
export const getSuperAdminDashboardConfig = (
  openModal: (id: string, config: any) => void,
  closeModal: () => void,
  router: { push: (url: string) => void }
): SidebarConfig => {
  const handleLogout = () => {
    closeModal();
    router.push('/login');
  };

  return {
    items: [
      {
        id: 'users',
        label: 'Usuarios',
        url: '/users',
      },
      {
        id: 'create-user',
        label: 'Crear nuevo usuario',
        url: '/create-user',
      },
      {
        id: 'cerrar-sesion',
        label: 'Cerrar sesión',
        onClick: () => {
          openModal('logout', {
            title: 'Cerrar sesión',
            size: 'md',
            content: createLogoutModal(handleLogout, closeModal),
          });
        },
      },
    ],
  };
};

// Función principal que retorna la configuración basada en el tipo
export const getSidebarConfig = (
  type: 'admin' | 'super-admin',
  openModal: (id: string, config: any) => void,
  closeModal: () => void,
  router: { push: (url: string) => void }
): SidebarConfig => {
  switch (type) {
    case 'admin':
      return getAdminDashboardConfig(openModal, closeModal, router);
    case 'super-admin':
      return getSuperAdminDashboardConfig(openModal, closeModal, router);
    default:
      return getAdminDashboardConfig(openModal, closeModal, router);
  }
};
