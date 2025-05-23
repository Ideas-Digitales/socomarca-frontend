'use client';

import Image from 'next/image';
import Logo from '../global/Logo';
import HR from '../global/HR';
import {
  ChatBubbleBottomCenterIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentIcon,
  PowerIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { JSX } from 'react';
import useStore from '@/stores/base';

const avatar = '/assets/global/avatar.png';

interface Menu {
  label: string;
  icon: JSX.Element | string;
  submenu?: Submenu[];
}

interface Submenu {
  name: string;
}

const menu: Menu[] = [
  {
    label: 'Reporte de ventas',
    icon: <PresentationChartBarIcon className="w-5 h-5" />,
    submenu: [
      { name: 'Total de ventas' },
      { name: 'Transacciones exitosas' },
      { name: 'Cliente con más compra' },
      { name: 'Productos con más ventas' },
      { name: 'Comunas con más ventas' },
      { name: 'Categoría con más ventas' },
      { name: 'Transacciones fallidas o canceladas' },
    ],
  },
  {
    label: 'Productos',
    icon: <ShoppingBagIcon className="w-5 h-5" />,
  },
  {
    label: 'Categorías',
    icon: <SquaresPlusIcon className="w-5 h-5" />,
  },
  {
    label: 'Clientes',
    icon: <UserCircleIcon className="w-5 h-5" />,
  },
  {
    label: 'Información del sitio',
    icon: <DocumentIcon className="w-5 h-5" />,
  },
  {
    label: 'Términos y condiciones',
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
  },
  {
    label: 'Políticas y privacidad',
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
  },
  {
    label: 'Preguntas frecuentes',
    icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
  },
  {
    label: 'Mensaje para el cliente',
    icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" />,
  },
  {
    label: 'Cerrar sesión',
    icon: <PowerIcon className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const userName = 'Alex Mandarino';

  const {
    isMenuActive,
    isSubmenuActive,
    isSubmenuOpen,
    handleMenuClick,
    handleSubmenuClick,
  } = useStore();

  return (
    <nav className="flex min-w-[290px] flex-col items-center bg-slate-100">
      {/* Logo */}
      <div className="py-8 px-6 mx-auto">
        <Logo width={218} height={39} />
      </div>
      <HR />

      {/* Perfil */}
      <div className="flex py-[14px] px-6 gap-5 items-center w-full">
        <Image
          src={avatar}
          alt="Avatar image"
          width={50}
          height={50}
          style={{
            width: '50px',
            height: '50px',
          }}
        />
        <span className="text-xs w-full">
          Hola <br />
          {userName}
        </span>
      </div>
      <HR />

      {/* Menu */}
      <div className="w-full">
        {menu.map((item, index) => (
          <div key={index} className="flex flex-col w-full">
            <div
              className={`flex items-center gap-3 py-4 px-6 text-sm cursor-pointer transition-all ease-in-out duration-500 ${
                isMenuActive(index)
                  ? 'bg-lime-100 text-black hover:bg-lime-200'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
              onClick={() => handleMenuClick(index, !!item.submenu)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.submenu && (
                <span className="flex-shrink-0 transition-transform ease-in-out duration-500">
                  <ChevronRightIcon
                    className={`w-4 h-4 transition-transform duration-200 transform ${
                      isSubmenuOpen(index) ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </span>
              )}
            </div>
            {item.submenu && (
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isSubmenuOpen(index)
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col bg-slate-50">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={`flex items-center gap-3 py-2 px-6 text-sm cursor-pointer transition-colors duration-200 ${
                        isSubmenuActive(index, subIndex)
                          ? ' text-black font-medium'
                          : 'text-slate-500 hover:bg-slate-200'
                      }`}
                      onClick={() => handleSubmenuClick(index, subIndex)}
                    >
                      <span>{subItem.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <HR />
          </div>
        ))}
      </div>
    </nav>
  );
}
