import { StateCreator } from 'zustand';
import { SidebarSlice, StoreState } from '../types';

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
