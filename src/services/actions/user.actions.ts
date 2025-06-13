'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export async function getUserData() {
  const { getCookie } = await cookiesManagement();

  const userId = getCookie('userId');
  const token = getCookie('token');

  if (!userId) {
    throw new Error('No userId found in cookies');
  }

  if (!token) {
    throw new Error('No token found in cookies');
  }

  const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // Puedes agregar next options si estás en Next.js:
    // next: { revalidate: 0 }, // para evitar cache
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user data: ${res.statusText}`);
  }
const data = await res.json();
return data;

}
