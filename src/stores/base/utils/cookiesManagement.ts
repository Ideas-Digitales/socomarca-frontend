import { cookies } from 'next/headers';

export const cookiesManagement = async () => {
  const cookieStore = await cookies();
  const setCookie = (cookie: string): boolean => {
    if (!cookie || typeof cookie !== 'string') {
      return false;
    }

    cookieStore.set({
      name: 'token',
      value: cookie,
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
