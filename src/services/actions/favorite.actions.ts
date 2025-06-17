'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export async function fetchGetFavoriteLists() {
  const { getCookie } = await cookiesManagement();
  const cookie = getCookie('token');

  if (!cookie) {
    return {
      ok: false,
      data: null,
      error: 'Unauthorized: No token provided',
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/favorites`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching favorite lists');
    }

    const data = await response.json();
    return {
      ok: true,
      data: data.data,
      error: null,
    };
  } catch (error) {
    console.log('Error fetching categories:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function fetchCreateFavoriteList(name: string) {
  const { getCookie } = await cookiesManagement();
  const cookie = getCookie('token');

  if (!cookie) {
    return {
      ok: false,
      data: null,
      error: 'Unauthorized: No token provided',
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/favorites-list`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Error creating favorite list');
    }

    const data = await response.json();
    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.log('Error creating favorite list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}


