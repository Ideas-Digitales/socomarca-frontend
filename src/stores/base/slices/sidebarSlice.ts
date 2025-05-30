import { StateCreator } from 'zustand';
import { SidebarSlice, StoreState } from '../types';
import { SidebarConfig } from '@/interfaces/sidebar.interface';

export const createSidebarSlice: StateCreator<
  StoreState & SidebarSlice,
  [],
  [],
  SidebarSlice
> = (set, get) => ({
  // Estados iniciales
  activeItem: null,
  openSubmenus: [],
  isMobileSidebarOpen: false,
  currentSidebarConfig: null,

  // Acción para establecer la configuración del sidebar
  setSidebarConfig: (config: SidebarConfig) => {
    set({
      currentSidebarConfig: config,
      // Reset navigation cuando cambia la configuración
      activeItem: config.defaultActiveItem || null,
      openSubmenus: [],
    });
  },

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

  // Función para activar menú basado en URL
  setActiveItemByUrl: (currentPath: string) => {
    const { currentSidebarConfig } = get();

    if (!currentSidebarConfig) {
      console.warn('No sidebar configuration set');
      return;
    }

    let foundItem = null;
    const menuItems = currentSidebarConfig.items;

    // Buscar en submenús primero
    for (let menuIndex = 0; menuIndex < menuItems.length; menuIndex++) {
      const menuItem = menuItems[menuIndex];

      // Verificar submenús (soportar tanto 'submenu' como 'subItems')
      const subItems = menuItem.submenu || menuItem.subItems;

      if (subItems) {
        for (
          let submenuIndex = 0;
          submenuIndex < subItems.length;
          submenuIndex++
        ) {
          const submenuItem = subItems[submenuIndex];
          const submenuUrl = submenuItem.url || submenuItem.href;

          if (submenuUrl === currentPath) {
            foundItem = { type: 'submenu' as const, menuIndex, submenuIndex };
            break;
          }
        }
      } else {
        // Verificar URL del menú principal (soportar tanto 'url' como 'href')
        const menuUrl = menuItem.url || menuItem.href;
        if (menuUrl === currentPath) {
          foundItem = { type: 'menu' as const, menuIndex };
          break;
        }
      }

      if (foundItem) break;
    }

    // Solo actualizar el item activo
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
    const { currentSidebarConfig } = get();

    if (!currentSidebarConfig) return;

    if (hasSubmenu) {
      get().toggleSubmenu(menuIndex);
    } else {
      const menuItem = currentSidebarConfig.items[menuIndex];

      // Si tiene onClick personalizado, ejecutarlo
      if (menuItem.onClick) {
        menuItem.onClick();
      }

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
