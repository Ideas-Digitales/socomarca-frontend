import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { NextRequest, NextResponse } from 'next/server';

type UserRole = 'cliente' | 'admin' | 'superadmin';

export default async function middleware(request: NextRequest) {
  // Saltar middleware en modo QA
  if (process.env.QA_MODE === 'true') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // ========== RUTAS COMPLETAMENTE PÚBLICAS ==========
  const publicPaths = [
    '/login',
    '/login-admin',
    '/recuperar',
    '/recuperar-admin',
    '/auth',
    '/acceso-denegado',
  ];

  // Si es una ruta pública, permitir siempre
  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    )
  ) {
    return NextResponse.next();
  }

  // ========== OBTENER DATOS DE AUTENTICACIÓN ==========
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');
  const userRole = getCookie('role') as UserRole;

  // Debug: agregar logs temporales
  console.log('🔍 Debug Middleware:', {
    pathname,
    token: !!token,
    userRole,
    timestamp: new Date().toISOString(),
  });

  // ========== MANEJAR RUTA RAÍZ ==========
  if (pathname === '/') {
    // Verificar autenticación primero
    if (!token || !userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Solo los clientes pueden ver la ruta raíz, otros roles redirigir
    if (userRole === 'cliente') {
      return NextResponse.next(); // Permitir acceso a la página principal de (private)
    } else if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/total-de-ventas', request.url));
    } else if (userRole === 'superadmin') {
      return NextResponse.redirect(new URL('/super-admin/users', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ========== VERIFICAR AUTENTICACIÓN ==========
  if (!token || !userRole) {
    // Determinar a qué login redirigir según la ruta
    const isAdminRoute =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/super-admin');

    const loginUrl = isAdminRoute ? '/auth/login-admin' : '/auth/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // ========== VERIFICAR ROLES Y PERMISOS ==========
  let hasPermission = false;

  // Rutas para ADMIN y SUPERADMIN (superadmin puede acceder a todo lo de admin)
  if (pathname.startsWith('/admin')) {
    hasPermission = userRole === 'admin' || userRole === 'superadmin';
    console.log('👨‍💼 Admin route check:', { hasPermission, userRole, pathname });
  }
  // Rutas para SUPERADMIN únicamente
  else if (pathname.startsWith('/super-admin')) {
    hasPermission = userRole === 'superadmin';
    console.log('🦸‍♂️ Superadmin route check:', { hasPermission, userRole, pathname });
  }
  // Rutas para CLIENTE únicamente - todas las rutas de la carpeta (private)
  else if (
    pathname.startsWith('/carro-de-compra') ||
    pathname.startsWith('/compra-exitosa') ||
    pathname.startsWith('/compra-fallida') ||
    pathname.startsWith('/direcciones') ||
    pathname.startsWith('/favoritos') ||
    pathname.startsWith('/finalizar-compra') ||
    pathname.startsWith('/gracias') ||
    pathname.startsWith('/medios-de-pago') ||
    pathname.startsWith('/mi-cuenta') ||
    pathname.startsWith('/mis-compras') ||
    pathname.startsWith('/politica-de-privacidad') ||
    pathname.startsWith('/preguntas-frecuentes') ||
    pathname.startsWith('/repetir-compra') ||
    pathname.startsWith('/revisar-pedido') ||
    pathname.startsWith('/terminos-y-condiciones')
  ) {
    hasPermission = userRole === 'cliente';
    console.log('👤 Client route check:', { hasPermission, userRole, pathname });
  }
  // Otras rutas protegidas - denegar por defecto
  else {
    hasPermission = false;
    console.log('❌ Unknown route, denying access:', { pathname, userRole });
  }

  console.log('🚪 Final permission check:', { hasPermission, pathname, userRole });

  // Si no tiene permisos, redirigir a acceso denegado
  if (!hasPermission) {
    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
  }

  // Permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
};