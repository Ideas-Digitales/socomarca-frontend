import type { Address } from '@/services/actions/addressees.actions';

export type BranchType = 'P' | 'S';

/**
 * Sucursal para la que el usuario autenticado puede emitir pedidos. Cada sucursal
 * es un usuario: `id` es el `customer_id` que se envía al pagar.
 */
export interface Branch {
  id: number;
  name: string;
  email: string | null;
  billing_email: string | null;
  phone: string | null;
  rut: string | null;
  business_name: string | null;
  /** Código de entidad de Random (KOEN) */
  user_code: string | null;
  /** Código de sucursal de Random (SUEN) */
  branch_code: string | null;
  branch_type: BranchType | null;
  addresses?: Address[];
}

export function branchTypeLabel(type: BranchType | null): string {
  if (type === 'P') return 'Principal';
  if (type === 'S') return 'Secundaria';
  return '';
}

export interface BranchesResponse {
  data: Branch[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
