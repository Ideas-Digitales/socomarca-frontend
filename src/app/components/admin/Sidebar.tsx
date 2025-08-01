'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '../global/Logo';
import HR from '../global/HR';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import useStore from '@/stores/base';
import { getSidebarConfig } from '@/configs/sidebarConfigs';
import useAuthStore from '@/stores/useAuthStore';

// Componente para mostrar las iniciales del usuario
const UserInitialsAvatar = ({ userName }: { userName: string }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(userName);

  return (
    <div 
      className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #267e00 0%, #6cb409 100%)',
      }}
    >
      {initials}
    </div>
  );
};

interface SidebarProps {
  configType: 'admin' | 'superadmin';
  userRole: 'admin' | 'superadmin';
  userName?: string;
}

export default function Sidebar({
  configType,
  userRole,
  userName,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  // Usar el nombre del usuario del store si no se proporciona uno
  const displayName = userName || user?.name || 'Usuario';

  const {
    isMenuActive,
    isSubmenuActive,
    isSubmenuOpen,
    handleMenuClick,
    handleSubmenuClick,
    setActiveItemByUrl,
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

  // Detectar y activar el menú correcto basado en la URL actual
  useEffect(() => {
    if (currentSidebarConfig) {
      setActiveItemByUrl(pathname);
    }
  }, [pathname, setActiveItemByUrl, currentSidebarConfig]);

  // Función para manejar navegación
  const handleNavigation = (item: any, index: number) => {
    const subItems = item.submenu || item.subItems;

    if (subItems) {
      handleMenuClick(index, true);
    } else if (item.url || item.href) {
      const url = item.url || item.href;
      router.push(url);
      handleMenuClick(index, false);
    } else if (item.onClick) {
      item.onClick();
      handleMenuClick(index, false);
    }
  };
  const handleSubmenuNavigation = (
    subItem: any,
    menuIndex: number,
    subIndex: number
  ) => {
    const url = subItem.url || subItem.href;
    if (url) {
      router.push(url);
    }
    
    // Ejecutar función personalizada si existe
    if (subItem.onClick) {
      subItem.onClick();
    }
    
    handleSubmenuClick(menuIndex, subIndex);
  };

  if (!currentSidebarConfig) {
    return null;
  }
  return (
    <nav 
      data-cy="sidebar"
      className="fixed left-0 top-0 h-screen w-[290px] flex flex-col items-center bg-slate-100 z-10"
    >
      {/* Logo - Fixed at top */}
      <div className="py-8 px-6 mx-auto flex-shrink-0">
        <Logo width={218} height={39} />
      </div>
      <HR />

      {/* Perfil - Fixed below logo */}
      <div className="flex py-[14px] px-6 gap-5 items-center w-full flex-shrink-0 min-w-0">
        <div className="flex-shrink-0">
          <UserInitialsAvatar userName={displayName} />
        </div>
        <span className="text-xs flex-1 min-w-0 truncate">
          Hola <br />
          {displayName}
        </span>
      </div>
      <HR />

      {/* Menu - Scrollable area */}
      <div className="w-full flex-1 overflow-y-auto">
        {currentSidebarConfig.items.map((item, index) => {
          const IconComponent = item.icon;
          const subItems = item.submenu || item.subItems;

          return (
            <div key={item.id || index} className="flex flex-col w-full">
              <div
                className={`flex items-center gap-3 py-4 px-6 text-sm cursor-pointer transition-all ease-in-out duration-500 ${
                  isMenuActive(index)
                    ? 'bg-lime-100 text-black hover:bg-lime-200'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
                onClick={() => handleNavigation(item, index)}
              >
                <span className="flex-shrink-0">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </span>
                <span className="flex-1">{item.label}</span>
                {subItems && (
                  <span className="flex-shrink-0 transition-transform ease-in-out duration-500">
                    <ChevronRightIcon
                      className={`w-4 h-4 transition-transform duration-200 transform ${
                        isSubmenuOpen(index) ? 'rotate-90' : 'rotate-0'
                      }`}
                    />
                  </span>
                )}
              </div>
              {subItems && (
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isSubmenuOpen(index)
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex flex-col bg-slate-50">
                    {subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`flex items-center gap-3 py-2 px-6 text-sm cursor-pointer transition-colors duration-200 ${
                          isSubmenuActive(index, subIndex)
                            ? 'text-black font-medium bg-lime-50 border-r-2 border-lime-400'
                            : 'text-slate-500 hover:bg-slate-200'
                        }`}
                        onClick={() =>
                          handleSubmenuNavigation(subItem, index, subIndex)
                        }
                      >
                        <span>{subItem.name || subItem.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <HR />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
