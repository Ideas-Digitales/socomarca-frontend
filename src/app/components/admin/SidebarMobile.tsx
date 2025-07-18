import { useEffect } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '../global/Logo';
import useStore from '@/stores/base';
import { getSidebarConfig } from '@/configs/sidebarConfigs';
import useAuthStore from '@/stores/useAuthStore';

interface SidebarMobileProps {
  configType: 'admin' | 'superadmin';
  userRole: 'admin' | 'superadmin';
}

export default function SidebarMobile({ configType }: SidebarMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  // Estados del store
  const {
    isMobileSidebarOpen,
    openSubmenus,
    setMobileSidebarOpen,
    closeMobileSidebar,
    handleMenuClick,
    handleSubmenuClick,
    resetNavigation,
    setActiveItemByUrl,
    isMenuActive,
    isSubmenuActive,
    setSidebarConfig,
    currentSidebarConfig,
    openModal,
    closeModal,
  } = useStore();

  // Establecer la configuración del sidebar cuando el componente se monta
  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await getSidebarConfig(
          configType,
          openModal,
          closeModal,
          router,
          logout
        );
        setSidebarConfig(config);
      } catch (error) {
        console.error('Error setting sidebar config:', error);
      }
    };

    loadSidebarConfig();
  }, [configType, setSidebarConfig, openModal, closeModal, router]);

  // Obtener información del submenú activo
  const openSubmenuIndex = openSubmenus.length > 0 ? openSubmenus[0] : null;
  const activeSubmenuItem =
    openSubmenuIndex !== null && currentSidebarConfig
      ? currentSidebarConfig.items[openSubmenuIndex]
      : null;

  // Detectar y activar el menú correcto basado en la URL actual
  useEffect(() => {
    if (currentSidebarConfig) {
      setActiveItemByUrl(pathname);
    }
  }, [pathname, setActiveItemByUrl, currentSidebarConfig]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSubmenuItem) {
          // Si hay submenu activo, solo cerrarlo (volver al menú principal)
          resetNavigation();
        } else if (isMobileSidebarOpen) {
          // Si no hay submenu, cerrar todo el sidebar
          closeMobileSidebar();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [
    isMobileSidebarOpen,
    activeSubmenuItem,
    closeMobileSidebar,
    resetNavigation,
  ]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  const handleItemClick = (item: any, index: number) => {
    const subItems = item.submenu || item.subItems;

    if (subItems) {
      // Tiene submenu - usar el store para manejarlo
      handleMenuClick(index, true);
    } else {
      // No tiene submenu - navegar directamente
      const url = item.url || item.href;
      if (url) {
        router.push(url);
      } else if (item.onClick) {
        // Ejecutar función personalizada (ej: cerrar sesión)
        item.onClick();
      }
      handleMenuClick(index, false); // Esto cerrará el sidebar automáticamente
    }
  };  const handleSubItemClick = (
    subItem: any,
    menuIndex: number,
    subIndex: number
  ) => {
    // Navegar si hay URL
    const url = subItem.url || subItem.href;
    if (url) {
      router.push(url);
    }
    
    // Ejecutar función personalizada si existe (ej: logout)
    if (subItem.onClick) {
      subItem.onClick();
    }
    
    // Actualizar el estado del sidebar
    handleSubmenuClick(menuIndex, subIndex);
    
    // Cerrar el sidebar móvil después de la navegación
    closeMobileSidebar();
    resetNavigation();
  };

  const handleBackToMain = () => {
    // Cerrar todos los submenus pero mantener el sidebar abierto
    if (openSubmenuIndex !== null) {
      handleMenuClick(openSubmenuIndex, true); // Esto toggleará y cerrará el submenu
    }
  };

  const handleOverlayClick = () => {
    closeMobileSidebar();
    resetNavigation();
  };

  // Si no hay configuración, no renderizar nada
  if (!currentSidebarConfig) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <nav className="px-[30px] py-[22px] w-full flex justify-between bg-white items-center fixed top-0 left-0 right-0 z-30 shadow-md">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1 hover:bg-slate-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Abrir menú"
        >
          <Bars3Icon width={31} height={31} className="text-slate-700" />
        </button>
        <Logo width={213} height={38} />
      </nav>

      {/* Overlay con animación mejorada */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity ease-in-out duration-300"
          onClick={handleOverlayClick}
        />
      )}      {/* Sidebar principal con animación mejorada */}
      <div
        data-cy="sidebar"
        className={`
        fixed top-0 left-0 h-full w-80 bg-slate-100 shadow-2xl z-50 transform transition-all ease-in-out duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b-[1px] border-slate-300">
          <button
            onClick={() => {
              closeMobileSidebar();
              resetNavigation();
            }}
            className="p-2 hover:bg-slate-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 flex justify-between items-center w-full"
            aria-label="Cerrar menú"
          >
            <ChevronLeftIcon width={20} height={20} />
            <h2 className="text-lg uppercase text-[15px] font-medium">
              Volver atrás
            </h2>
            <XMarkIcon width={24} height={24} />
          </button>
        </div>

        {/* Items del menú */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide max-h-[90vh]">
          {currentSidebarConfig.items.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = isMenuActive(index);
            const subItems = item.submenu || item.subItems;

            return (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item, index)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-all ease-in-out duration-300 focus:outline-none group border-b-[1px] border-slate-300 ${
                  isActive
                    ? 'bg-lime-100 hover:bg-lime-200'
                    : 'hover:bg-slate-50 focus:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent
                      className={`w-5 h-5 transition-all ease-in-out duration-300 ${
                        isActive
                          ? 'text-lime-700'
                          : 'text-slate-600 group-hover:text-slate-800'
                      }`}
                    />
                  )}
                  <span
                    className={`font-medium transition-all ease-in-out duration-300 ${
                      isActive
                        ? 'text-lime-900'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {subItems && (
                  <ChevronRightIcon
                    className={`w-5 h-5 transition-all ease-in-out duration-300 ${
                      isActive
                        ? 'text-lime-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submenu */}
      {activeSubmenuItem && (
        <div className="fixed top-0 left-0 h-full w-80 bg-slate-100 shadow-2xl z-[60] transform transition-all duration-300 ease-out translate-x-0 animate-in slide-in-from-left">
          {/* Header del submenu */}
          <div className="flex items-center gap-4 p-4 bg-slate-100 border-b-[1px] border-slate-300">
            <button
              onClick={handleBackToMain}
              className="p-2 hover:bg-white/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Volver atrás"
            >
              <ChevronLeftIcon width={24} height={24} />
            </button>
            <h2 className="text-lg font-medium uppercase text-[15px] flex-1">
              {activeSubmenuItem.label}
            </h2>
          </div>

          {/* Items del submenu */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
            {(activeSubmenuItem.submenu || activeSubmenuItem.subItems)?.map(
              (subItem, subIndex) => {
                const menuIndex = openSubmenuIndex!;
                const isSubActive = isSubmenuActive(menuIndex, subIndex);

                return (
                  <button
                    key={subIndex}
                    onClick={() => {
                      handleSubItemClick(subItem, menuIndex, subIndex);
                    }}
                    className={`w-full flex items-center px-8 py-4 text-left transition-colors focus:outline-none group border-b-[1px] border-slate-300 ${
                      isSubActive
                        ? 'bg-lime-50 hover:bg-lime-100 border-r-4 border-r-lime-400'
                        : 'hover:bg-slate-50 focus:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`transition-colors ${
                        isSubActive
                          ? 'text-lime-900 font-medium'
                          : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {subItem.name || subItem.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}
