'use client';

import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  HeartIcon,
  KeyIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const items = [
  { key: 'datos', label: 'Datos de Facturación', icon: UserIcon },
  { key: 'direcciones', label: 'Direcciones', icon: MapPinIcon },
  { key: 'favoritos', label: 'Mis favoritos', icon: HeartIcon },
  { key: 'compras', label: 'Mis compras', icon: ShoppingBagIcon },
  { key: 'cambiar-contraseña', label: 'Cambiar contraseña', icon: KeyIcon },
  { key: 'logout', label: 'Cerrar sesión', icon: ArrowRightOnRectangleIcon },
];

export default function Sidebar({
  selectedKey,
  onSelect,
  onLogoutClick, // nuevo
}: {
  selectedKey: string;
  onSelect: (key: string) => void;
  onLogoutClick?: () => void; // opcional
}) {
  return (
    <div className="w-full hidden lg:block md:w-64 bg-white rounded-lg shadow h-fit">
      {items.map((item) => (
        <button
          key={item.key}
          data-cy={item.key === 'logout' ? 'logout-btn' : undefined}
          onClick={() =>
            item.key === 'logout' ? onLogoutClick?.() : onSelect(item.key)
          }
          className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium border-b border-b-slate-200 hover:bg-gray-50 ${
            selectedKey === item.key
              ? 'bg-lime-100 text-black'
              : 'text-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span> {item.label} </span>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        </button>
      ))}
    </div>
  );
}
