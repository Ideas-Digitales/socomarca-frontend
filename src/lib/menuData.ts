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
      { label: 'Total de ventas', href: '/admin/reports/total' },
      { label: 'Transacciones exitosas', href: '/admin/reports/successful' },
      { label: 'Cliente con más compra', href: '/admin/reports/top-customer' },
      {
        label: 'Productos con más ventas',
        href: '/admin/reports/top-products',
      },
      { label: 'Comunas con más ventas', href: '/admin/reports/top-locations' },
      {
        label: 'Categoría con más ventas',
        href: '/admin/reports/top-categories',
      },
      {
        label: 'Transacciones fallidas o canceladas',
        href: '/admin/reports/failed',
      },
    ],
  },
  {
    id: 'products',
    label: 'Productos',
    icon: ShoppingBagIcon,
    href: '/admin/products',
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: SquaresPlusIcon,
    href: '/admin/categories',
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: UserCircleIcon,
    href: '/admin/clients',
  },
  {
    id: 'site-info',
    label: 'Información del sitio',
    icon: DocumentIcon,
    href: '/admin/site-info',
  },
  {
    id: 'terms',
    label: 'Términos y condiciones',
    icon: ClipboardDocumentCheckIcon,
    href: '/admin/terms',
  },
  {
    id: 'privacy',
    label: 'Políticas y privacidad',
    icon: ClipboardDocumentListIcon,
    href: '/admin/privacy',
  },
  {
    id: 'faq',
    label: 'Preguntas frecuentes',
    icon: QuestionMarkCircleIcon,
    href: '/admin/faq',
  },
  {
    id: 'messages',
    label: 'Mensaje para el cliente',
    icon: ChatBubbleBottomCenterIcon,
    href: '/admin/messages',
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: PowerIcon,
    href: '/logout',
  },
];
