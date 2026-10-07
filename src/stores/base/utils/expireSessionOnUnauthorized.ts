import { redirect } from 'next/navigation';
import { cookiesManagement } from './cookiesManagement';

const SESSION_COOKIES = ['token', 'role', 'permissions', 'userId', 'userData'];
const ADMIN_ROLES = ['admin', 'superadmin'];

/**
 * El backend revoca de inmediato los tokens de los usuarios desactivados, así que un
 * `401` en una ruta autenticada significa que la sesión expiró: se limpian las
 * cookies y se redirige al login que corresponde al rol.
 *
 * Solo sirve en server actions. `redirect` lanza una excepción, por lo que los
 * `catch` de quien lo llame deben empezar con `unstable_rethrow(error)`.
 */
export async function expireSessionOnUnauthorized(response: Response): Promise<void> {
  if (response.status !== 401) return;

  const { getCookie, deleteCookie } = await cookiesManagement();
  const role = getCookie('role');
  const roles = typeof role === 'string' ? role.split(',') : [];

  SESSION_COOKIES.forEach((name) => deleteCookie(name));

  redirect(
    roles.some((r) => ADMIN_ROLES.includes(r)) ? '/auth/login-admin' : '/auth/login'
  );
}
