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

export async function fetchAddProductToFavoriteList(
  favoriteListId: number,
  productId: number,
  unit: string
) {
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
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify({
        favorite_list_id: favoriteListId,
        product_id: productId,
        unit,
      }),
    });

    if (!response.ok) {
      throw new Error('Error adding product to favorite list');
    }

    const data = await response.json();
    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.log('Error adding product to favorite list:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function fetchRemoveProductFromFavorites(favoriteId: number) {
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
    const response = await fetch(`${BACKEND_URL}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
    });

    if (!response.ok) {
      // Intentar leer el error del servidor si es posible
      let errorMessage = `HTTP ${response.status}: Error removing product from favorites`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.log('Server error response:', errorData);
      } catch {
        console.log('Could not parse error response as JSON');
      }
      
      console.log('Failed to remove product from favorites:', {
        favoriteId,
        status: response.status,
        statusText: response.statusText,
        url: `${BACKEND_URL}/favorites/${favoriteId}`
      });
      
      return {
        ok: false,
        data: null,
        error: errorMessage,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    console.log('Error removing product from favorites:', error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export const changeFavoriteListName = async (
  listId: number,
  newName: string
): Promise<{ ok: boolean; data?: any; error?: string }> => {
  const { getCookie } = await cookiesManagement();
  const cookie = getCookie('token');

  if (!cookie) {
    return {
      ok: false,
      error: 'Unauthorized: No token provided',
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/favorites-list/${listId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    if (!response.ok) {
      throw new Error('Error updating favorite list name');
    }
    const data = await response.json();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error('Error updating favorite list name:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

export const deleteFavoriteList = async (
  listId: number
): Promise<{ ok: boolean; data?: any; error?: string }> => {
  try {
    const { getCookie } = await cookiesManagement();
    const cookie = getCookie('token');

    if (!cookie) {
      return {
        ok: false,
        error: 'Unauthorized: No token provided',
      };
    }

    const response = await fetch(`${BACKEND_URL}/favorites-list/${listId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cookie}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting favorite list');
    }

    const data = await response.json();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error('Error deleting favorite list:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
