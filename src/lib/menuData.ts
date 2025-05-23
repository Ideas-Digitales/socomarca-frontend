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
} from '@heroicons/react/24/outline';

export interface SubMenuItem {
  label: string;
  href: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'reports',
    label: 'Reporte de ventas',
    icon: PresentationChartBarIcon,
    subItems: [
      { label: 'Total de ventas', href: '/admin/total-de-ventas' },
      {
        label: 'Transacciones exitosas',
        href: '/admin/transacciones-exitosas',
      },
      { label: 'Cliente con más compra', href: '/admin/clientes-mas-compra' },
      {
        label: 'Productos con más ventas',
        href: '/admin/productos-mas-ventas',
      },
      { label: 'Comunas con más ventas', href: '/admin/comunas-mas-ventas' },
      {
        label: 'Categoría con más ventas',
        href: '/admin/categoria-mas-ventas',
      },
      {
        label: 'Transacciones fallidas o canceladas',
        href: '/admin/transacciones-fallidas',
      },
    ],
  },
  {
    id: 'products',
    label: 'Productos',
    icon: ShoppingBagIcon,
    href: '/admin/productos',
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: SquaresPlusIcon,
    href: '/admin/categorias',
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: UserCircleIcon,
    href: '/admin/clientes',
  },
  {
    id: 'site-info',
    label: 'Información del sitio',
    icon: DocumentIcon,
    href: '/admin/informacion-sitio',
  },
  {
    id: 'terms',
    label: 'Términos y condiciones',
    icon: ClipboardDocumentCheckIcon,
    href: '/admin/terminos-condiciones',
  },
  {
    id: 'privacy',
    label: 'Políticas y privacidad',
    icon: ClipboardDocumentListIcon,
    href: '/admin/politicas-privacidad',
  },
  {
    id: 'faq',
    label: 'Preguntas frecuentes',
    icon: QuestionMarkCircleIcon,
    href: '/admin/preguntas-frecuentes',
  },
  {
    id: 'messages',
    label: 'Mensaje para el cliente',
    icon: ChatBubbleBottomCenterIcon,
    href: '/admin/mensaje-cliente',
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: PowerIcon,
  },
];
