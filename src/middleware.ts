import { NextRequest, NextResponse } from 'next/server';

type UserRole = 'cliente' | 'admin' | 'superadmin';

interface AuthData {
  authenticated: boolean;
  user?: {
    role: string;
    userId: string;
  };
  reason?: string;
}

// Función para obtener datos de autenticación desde la API interna
async function getAuthData(
  request: NextRequest,
  validateToken = false
): Promise<AuthData> {
  try {
    const url = new URL('/api/internal/auth', request.url);
    if (validateToken) {
      url.searchParams.set('validate', 'true');
    }

    const response = await fetch(url.toString(), {
      headers: {
        // Pasar las cookies del request original
        Cookie: request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        authenticated: false,
        reason: data.reason || 'Auth check failed',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Middleware - Error checking auth:', error);
    return {
      authenticated: false,
      reason: 'Internal error',
    };
  }
}

// Función para limpiar cookies usando la API interna
async function clearAuthCookies(request: NextRequest): Promise<void> {
  try {
    await fetch(new URL('/api/internal/auth', request.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ action: 'clear' }),
    });
  } catch (error) {
    console.error('Middleware - Error clearing cookies:', error);
  }
}

export default async function middleware(request: NextRequest) {
  // Saltar middleware en modo QA
  if (process.env.QA_MODE === 'true') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;


  // ========== RUTAS COMPLETAMENTE PÚBLICAS ==========
  const publicPaths = [
    '/auth/login',
    '/auth/login-admin',
    '/auth/recuperar',
    '/auth/recuperar-admin',
    '/acceso-denegado',
    '/api/internal/auth', // Importante: permitir nuestra API interna
  ];

  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    )
  ) {
    return NextResponse.next();
  }

  // Saltar para assets y APIs externas
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ========== OBTENER DATOS DE AUTENTICACIÓN ==========
  const authData = await getAuthData(request);


  // ========== MANEJAR RUTA RAÍZ ==========
  if (pathname === '/') {
    if (!authData.authenticated) {
      console.log('Middleware - Not authenticated, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userRole = authData.user?.role as UserRole;

    // Validar token para ruta raíz
    const tokenValidation = await getAuthData(request, true);
    if (!tokenValidation.authenticated) {
      console.log('Middleware - Token invalid, clearing and redirecting');
      await clearAuthCookies(request);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirigir según el rol
    switch (userRole) {
      case 'cliente':
        console.log('Middleware - Cliente accessing root, allowing');
        return NextResponse.next();
      case 'admin':
        console.log('Middleware - Admin redirecting to dashboard');
        return NextResponse.redirect(
          new URL('/admin/total-de-ventas', request.url)
        );
      case 'superadmin':
        console.log('Middleware - Superadmin redirecting to dashboard');
        return NextResponse.redirect(
          new URL('/super-admin/users', request.url)
        );
      default:
        console.log('Middleware - Unknown role, redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // ========== VERIFICAR AUTENTICACIÓN PARA OTRAS RUTAS ==========
  if (!authData.authenticated) {
    console.log('Middleware - Not authenticated for protected route');
    const isAdminRoute =
      pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
    const loginUrl = isAdminRoute ? '/auth/login-admin' : '/auth/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  const userRole = authData.user?.role as UserRole;

  // ========== VALIDAR TOKEN PARA RUTAS CRÍTICAS ==========
  const criticalPaths = [
    '/admin',
    '/super-admin',
    '/mi-cuenta',
    '/mis-compras',
  ];
  const isCriticalPath = criticalPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isCriticalPath) {
    const tokenValidation = await getAuthData(request, true);

    if (!tokenValidation.authenticated) {
      console.log('Middleware - Token invalid for critical path');
      await clearAuthCookies(request);

      const isAdminRoute =
        pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
      const loginUrl = isAdminRoute ? '/auth/login-admin' : '/auth/login';
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  // ========== VERIFICAR PERMISOS DE ROLES ==========
  const routePermissions = {
    admin: pathname.startsWith('/admin'),
    superadmin: pathname.startsWith('/super-admin'),
    cliente: [
      '/carro-de-compra',
      '/compra-exitosa',
      '/redirect',
      '/webpay',
      '/compra-fallida',
      '/direcciones',
      '/favoritos',
      '/finalizar-compra',
      '/gracias',
      '/medios-de-pago',
      '/mi-cuenta',
      '/mis-compras',
      '/politica-de-privacidad',
      '/preguntas-frecuentes',
      '/repetir-compra',
      '/revisar-pedido',
      '/terminos-y-condiciones',
    ].some((path) => pathname.startsWith(path)),
  };

  let hasPermission = false;

  if (routePermissions.admin) {
    hasPermission = userRole === 'admin' || userRole === 'superadmin';
  } else if (routePermissions.superadmin) {
    hasPermission = userRole === 'superadmin';
  } else if (routePermissions.cliente) {
    hasPermission = userRole === 'cliente';
  } else {
    // Para rutas no definidas explícitamente, permitir si está autenticado
    hasPermission = true;
  }

  if (!hasPermission) {
    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/internal|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
};
