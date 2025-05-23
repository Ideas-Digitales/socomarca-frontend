import { StateCreator } from 'zustand';
import { SidebarSlice, StoreState } from '../types';

// Configuración de menús (debe coincidir con el menú del componente)
const menuConfig = [
  {
    label: 'Reporte de ventas',
    submenu: [
      { name: 'Total de ventas', url: '/admin/total-de-ventas' },
      { name: 'Transacciones exitosas', url: '/admin/transacciones-exitosas' },
      { name: 'Cliente con más compra', url: '/admin/cliente-mas-compra' },
      { name: 'Productos con más ventas', url: '/admin/productos-mas-ventas' },
      { name: 'Comunas con más ventas', url: '/admin/comunas-mas-ventas' },
      { name: 'Categoría con más ventas', url: '/admin/categoria-mas-ventas' },
      {
        name: 'Transacciones fallidas o canceladas',
        url: '/admin/transacciones-fallidas',
      },
    ],
  },
  {
    label: 'Productos',
    url: '/admin/productos',
  },
  {
    label: 'Categorías',
    url: '/admin/categorias',
  },
  {
    label: 'Clientes',
    url: '/admin/clientes',
  },
  {
    label: 'Información del sitio',
    url: '/admin/informacion-sitio',
  },
  {
    label: 'Términos y condiciones',
    url: '/admin/terminos-condiciones',
  },
  {
    label: 'Políticas y privacidad',
    url: '/admin/politicas-privacidad',
  },
  {
    label: 'Preguntas frecuentes',
    url: '/admin/preguntas-frecuentes',
  },
  {
    label: 'Mensaje para el cliente',
    url: '/admin/mensaje-cliente',
  },
  {
    label: 'Cerrar sesión',
  },
];

export const createSidebarSlice: StateCreator<
  StoreState & SidebarSlice,
  [],
  [],
  SidebarSlice
> = (set, get) => ({
  // Acciones de navegación
  setActiveItem: (item) => {
    set({ activeItem: item });
  },

  toggleSubmenu: (menuIndex) => {
    const { openSubmenus } = get();
    const updatedSubmenus = openSubmenus.includes(menuIndex)
      ? openSubmenus.filter((i) => i !== menuIndex)
      : [...openSubmenus, menuIndex];

    set({ openSubmenus: updatedSubmenus });
  },

  closeAllSubmenus: () => {
    set({ openSubmenus: [] });
  },

  // Acciones del sidebar móvil
  setMobileSidebarOpen: (isOpen) => {
    set({ isMobileSidebarOpen: isOpen });
  },

  closeMobileSidebar: () => {
    set({ isMobileSidebarOpen: false });
  },

  // Nueva función para activar menú basado en URL
  // Nueva función para activar menú basado en URL (SIN abrir submenús automáticamente)
  setActiveItemByUrl: (currentPath: string) => {
    let foundItem = null;

    // Buscar en submenús primero
    for (let menuIndex = 0; menuIndex < menuConfig.length; menuIndex++) {
      const menuItem = menuConfig[menuIndex];

      if (menuItem.submenu) {
        for (
          let submenuIndex = 0;
          submenuIndex < menuItem.submenu.length;
          submenuIndex++
        ) {
          const submenuItem = menuItem.submenu[submenuIndex];
          if (submenuItem.url === currentPath) {
            foundItem = { type: 'submenu' as const, menuIndex, submenuIndex };
            break;
          }
        }
      } else if (menuItem.url === currentPath) {
        foundItem = { type: 'menu' as const, menuIndex };
        break;
      }

      if (foundItem) break;
    }

    // Solo actualizar el item activo, NO abrir submenús automáticamente
    if (foundItem) {
      set({ activeItem: foundItem });
    }
  },

  // Helpers
  isMenuActive: (menuIndex) => {
    const { activeItem } = get();
    return (
      (activeItem?.type === 'menu' && activeItem.menuIndex === menuIndex) ||
      (activeItem?.type === 'submenu' && activeItem.menuIndex === menuIndex)
    );
  },

  isSubmenuActive: (menuIndex, submenuIndex) => {
    const { activeItem } = get();
    return (
      activeItem?.type === 'submenu' &&
      activeItem.menuIndex === menuIndex &&
      activeItem.submenuIndex === submenuIndex
    );
  },

  isSubmenuOpen: (menuIndex) => {
    const { openSubmenus } = get();
    return openSubmenus.includes(menuIndex);
  },

  // Reset completo
  resetNavigation: () => {
    set({
      activeItem: null,
      openSubmenus: [],
      isMobileSidebarOpen: false,
    });
  },

  // Acciones compuestas para facilitar el uso
  handleMenuClick: (menuIndex, hasSubmenu) => {
    if (hasSubmenu) {
      get().toggleSubmenu(menuIndex);
    } else {
      get().setActiveItem({ type: 'menu', menuIndex });
      // En móvil, cerrar sidebar al seleccionar un ítem sin submenú
      if (get().isMobile) {
        get().closeMobileSidebar();
      }
    }
  },

  handleSubmenuClick: (menuIndex, submenuIndex) => {
    get().setActiveItem({ type: 'submenu', menuIndex, submenuIndex });
    // En móvil, cerrar sidebar al seleccionar submenú
    if (get().isMobile) {
      get().closeMobileSidebar();
    }
  },
});
