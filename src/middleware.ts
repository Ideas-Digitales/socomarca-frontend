import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { NextRequest, NextResponse } from 'next/server';

// Definición de roles
type UserRole = 'colaborador' | 'administrador' | 'superadmin';

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/login',
  '/login-admin',
  '/recuperar',
  '/recuperar-admin',
  '/auth',
];

// Función para verificar si una ruta es pública
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(
    (route) => path === route || path.startsWith(route + '/')
  );
}

// Función para verificar acceso según la ruta y rol
function hasAccess(path: string, userRole: UserRole): boolean {
  // Rutas de administrador - solo admin y superadmin
  if (path.startsWith('/admin') || path.startsWith('/administrador')) {
    return ['administrador', 'superadmin'].includes(userRole);
  }

  // Rutas de super administrador - solo superadmin
  if (path.startsWith('/super-admin')) {
    return userRole === 'superadmin';
  }

  // Rutas privadas - todos los roles autenticados
  if (path.startsWith('/private')) {
    return ['colaborador', 'administrador', 'superadmin'].includes(userRole);
  }

  // Para cualquier otra ruta protegida, permitir solo usuarios autenticados
  return ['colaborador', 'administrador', 'superadmin'].includes(userRole);
}

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Si es ruta pública, permitir acceso
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Obtener cookies
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');
  const userRole = getCookie('role') as UserRole;

  // Verificar autenticación
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar si tiene rol válido
  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar acceso según rol
  if (!hasAccess(path, userRole)) {
    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
  }

  return NextResponse.next();
}

// Configuración del matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
};
