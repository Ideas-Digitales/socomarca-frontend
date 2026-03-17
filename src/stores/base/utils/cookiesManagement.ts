
import { cookies } from 'next/headers';

export const cookiesManagement = async () => {
  const cookieStore = await cookies();
  const setCookie = (cookie: string, cookieName: string, maxAge: number = 60 * 60 * 24 * 30): boolean => {
    if (cookie === undefined || cookie === null) {
      return false;
    }

    const cookieValue = String(cookie);
    if (cookieValue === '') {
      return false;
    }

    cookieStore.set({
      name: cookieName,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return true;
  };

  const getCookie = (name: string): string | boolean => {
    if (!name || typeof name !== 'string') {
      return false;
    }

    const cookie = cookieStore.get(name);
    if (!cookie) {
      return false;
    }
    return cookie.value;
  };

  const deleteCookie = (name: string): boolean => {
    if (!name || typeof name !== 'string') {
      return false;
    }

    const getCookieByName = getCookie(name);
    if (!getCookieByName) {
      return false;
    }

    cookieStore.delete(name);
    return true;
  };

  return {
    setCookie,
    getCookie,
    deleteCookie,
  };
};
