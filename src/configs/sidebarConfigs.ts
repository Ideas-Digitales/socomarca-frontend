import { SidebarConfig } from '@/interfaces/sidebar.interface';

// Configuración para el dashboard admin
export const adminDashboardConfig: SidebarConfig = {
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
        { name: 'Cliente con más compra', url: '/admin/cliente-mas-compra' },
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
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      onClick: () => {
        console.log('Cerrando sesión...');
      },
    },
  ],
};

// Ejemplo de otra configuración para un dashboard diferente
export const SuperAdminDashboardConfig: SidebarConfig = {
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
        console.log('Cerrando sesión...');
      },
    },
  ],
};

export const getSidebarConfig = (
  type: 'admin' | 'super-admin'
): SidebarConfig => {
  switch (type) {
    case 'admin':
      return adminDashboardConfig;
    case 'super-admin':
      return SuperAdminDashboardConfig;
    default:
      return adminDashboardConfig;
  }
};
