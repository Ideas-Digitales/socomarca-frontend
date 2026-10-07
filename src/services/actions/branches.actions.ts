'use server';

import { unstable_rethrow } from 'next/navigation';
import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { expireSessionOnUnauthorized } from '@/stores/base/utils/expireSessionOnUnauthorized';
import { BACKEND_URL, IS_QA_MODE } from '@/utils/getEnv';
import type { Branch, BranchesResponse } from '@/interfaces/branch.interface';

interface ActionResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export async function fetchBranches(
  perPage = 20,
  page = 1,
): Promise<ActionResult<BranchesResponse>> {
  try {
    if (IS_QA_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ok: true,
        data: {
          data: [
            {
              id: 6,
              name: 'Sucursal Norte',
              email: 'norte@example.com',
              billing_email: 'dte@example.com',
              phone: '56988888888',
              rut: '76123456-0',
              business_name: 'Casa Matriz Ltda',
              user_code: '76123456',
              branch_code: '002',
              branch_type: 'S',
              addresses: [
                {
                  id: 901,
                  address_line1: 'Av. Américo Vespucio 1501',
                  address_line2: '',
                  postal_code: '',
                  is_default: false,
                  type: 'shipping',
                  phone: '',
                  contact_name: '',
                  municipality_name: 'Cerrillos',
                  region_name: 'Región Metropolitana',
                  alias: null,
                  is_synced: true,
                },
              ],
            },
          ],
          links: { first: '', last: '', prev: null, next: null },
          meta: { current_page: 1, from: 1, last_page: 1, per_page: 20, total: 1 },
        },
        error: null,
      };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return { ok: false, data: null, error: 'Unauthorized: No token found' };
    }

    const params = new URLSearchParams({ per_page: String(perPage), page: String(page) });
    const response = await fetch(`${BACKEND_URL}/branches?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    await expireSessionOnUnauthorized(response);

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Error HTTP: ${response.status}`);
    }

    return { ok: true, data: json as BranchesResponse, error: null };
  } catch (error) {
    unstable_rethrow(error);
    console.error('Error fetching branches:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/** Todas las sucursales para las que el usuario puede emitir pedidos, recorriendo las páginas */
export async function fetchAllBranches(): Promise<ActionResult<Branch[]>> {
  const branches: Branch[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await fetchBranches(100, page);
    if (!res.ok || !res.data) {
      return { ok: false, data: null, error: res.error };
    }
    branches.push(...res.data.data);
    lastPage = res.data.meta.last_page;
    page++;
  } while (page <= lastPage);

  return { ok: true, data: branches, error: null };
}

export async function fetchBranch(
  id: number,
): Promise<ActionResult<{ data: Branch }>> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return { ok: false, data: null, error: 'Unauthorized: No token found' };
    }

    const response = await fetch(`${BACKEND_URL}/branches/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Error HTTP: ${response.status}`);
    }

    return { ok: true, data: json as { data: Branch }, error: null };
  } catch (error) {
    console.error('Error fetching branch:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
