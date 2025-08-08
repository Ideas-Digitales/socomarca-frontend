'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';
import { SearchUsersRequest } from '@/interfaces/user.interface';

export interface ApiAddress {
  id: number;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  is_default: boolean;
  type: string;
  phone: string;
  contact_name: string;
  municipality_name: string;
  region_name: string;
  alias: string | null;
}

export interface ApiUser {
  rut: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  billing_address: ApiAddress;
  default_shipping_address: ApiAddress;
}

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface UsersApiResponse {
  data: ApiUser[];
  meta: ApiMeta;
}

export async function getUserData() {
  try {
    const { getCookie } = await cookiesManagement();

    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const res = await fetch(`${BACKEND_URL}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}

export async function getUsersAction(params: {
  page?: number;
  per_page?: number;
}): Promise<{
  success: boolean;
  data?: UsersApiResponse;
  error?: string;
}> {
  try {
    const { page = 1, per_page = 10 } = params;

    const baseURL = process.env.BACKEND_URL;
    const url = new URL(`${baseURL}/users`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('per_page', per_page.toString());
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UsersApiResponse = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function searchUsersAction(
  searchRequest: SearchUsersRequest
): Promise<{
  success: boolean;
  data?: UsersApiResponse;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    // Construir el body según el formato esperado por el backend
    const requestBody: any = {
      filters: searchRequest.filters,
      per_page: searchRequest.per_page,
    };

    // Agregar página si está presente
    if (searchRequest.page) {
      requestBody.page = searchRequest.page;
    }

    // Agregar ordenamiento si está presente
    if (searchRequest.sort_by && searchRequest.sort_order) {
      // Buscar si ya existe un filtro con sort
      const existingSortFilter = requestBody.filters.find(
        (filter: any) => filter.sort
      );

      if (existingSortFilter) {
        existingSortFilter.sort = searchRequest.sort_order.toUpperCase();
      } else {
        // Agregar el sort al primer filtro existente
        if (requestBody.filters.length > 0) {
          requestBody.filters[0].sort = searchRequest.sort_order.toUpperCase();
        }
        // Si no hay filtros, no agregamos uno artificial solo para el sort
      }
    }

    const response = await fetch(`${BACKEND_URL}/users/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UsersApiResponse = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error searching users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function deleteUserAction(userId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  rut?: string;
  business_name?: string;
  is_active?: boolean;
  roles: string[];
}

export interface PatchUserRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  rut?: string;
  business_name?: string;
  is_active?: boolean;
  roles?: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  rut: string;
  business_name: string;
  is_active: boolean;
  roles: string[];
}

export async function updateUserAction(
  userId: number,
  userData: UpdateUserRequest
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function patchUserAction(
  userId: number,
  userData: PatchUserRequest
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error patching user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function changePasswordAction(
  passwordData: ChangePasswordRequest
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await fetch(`${BACKEND_URL}/profile/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function createUserAction(userData: CreateUserRequest): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await fetch(`${BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
