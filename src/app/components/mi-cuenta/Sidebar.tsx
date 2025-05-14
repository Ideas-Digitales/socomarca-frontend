'use client';

const items = [
  { key: 'datos', label: 'Datos personales', icon: '' },
  { key: 'direcciones', label: 'Direcciones', icon: '' },
  { key: 'favoritos', label: 'Mis favoritos', icon: '' },
  { key: 'compras', label: 'Mis compras', icon: '' },
  { key: 'logout', label: 'Cerrar sesión', icon: '' },
];

export default function Sidebar({ selectedKey, onSelect }: {
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium border-b hover:bg-gray-50 ${
            selectedKey === item.key ? 'bg-lime-100 text-black' : 'text-gray-700'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
} 