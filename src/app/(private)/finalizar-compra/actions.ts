import { cookies } from 'next/headers';

export async function getUserData() {
  const cookieStore = cookies();
  const userId = (await cookieStore).get('userId')?.value;
  if (!userId) {
    throw new Error('No userId found in cookies');
  }
  const res = await fetch(`${process.env.BAKEND_URL}/api/users/${userId}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }
  return res.json();
}
