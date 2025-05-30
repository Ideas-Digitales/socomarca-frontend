export interface SidebarSubmenuItem {
  name: string;
  url: string;
  label?: string;
  href?: string;
}

export interface SidebarMenuItem {
  id?: string;
  label: string;
  url?: string;
  href?: string;
  submenu?: SidebarSubmenuItem[];
  subItems?: SidebarSubmenuItem[];
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface SidebarConfig {
  items: SidebarMenuItem[];
  defaultActiveItem?: ActiveItem | null;
}

// Actualizar tipos existentes
export interface ActiveItem {
  type: 'menu' | 'submenu';
  menuIndex: number;
  submenuIndex?: number;
  configId?: string;
}
