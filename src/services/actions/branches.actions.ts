'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
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
              id: 5,
              name: 'Sucursal Norte',
              code: 'BRN001',
              email: 'norte@example.com',
              commercial_email: 'comercial@example.com',
              phone: '56977777777',
              rut: '11111111-1',
              business_name: 'Sucursal Norte Ltda',
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

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Error HTTP: ${response.status}`);
    }

    return { ok: true, data: json as BranchesResponse, error: null };
  } catch (error) {
    console.error('Error fetching branches:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
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
