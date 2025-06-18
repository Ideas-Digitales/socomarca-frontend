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

// Cache simple para evitar llamadas redundantes durante el mismo ciclo de solicitud
const authCache = new Map<string, { data: AuthData; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 segundos para reducir aún más las llamadas
const MAX_CACHE_SIZE = 100; // Limitar el tamaño del cache

// Función para limpiar cache viejo
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of authCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      authCache.delete(key);
    }
  }
  
  // Si el cache sigue siendo muy grande, eliminar las entradas más viejas
  if (authCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(authCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = entries.slice(0, authCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => authCache.delete(key));
  }
}

// Función para obtener datos de autenticación desde la API interna
async function getAuthData(
  request: NextRequest,
  validateToken = false
): Promise<AuthData> {  // Limpiar cache periódicamente
  if (Math.random() < 0.1) { // 10% de probabilidad
    cleanupCache();
  }
  
  // Crear clave de cache basada en cookies y validación
  const cookies = request.headers.get('cookie') || '';
  const cacheKey = `${cookies}-${validateToken}`;
  
  // Verificar cache
  const cached = authCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const url = new URL('/api/internal/auth', request.url);
    if (validateToken) {
      url.searchParams.set('validate', 'true');
    }

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });    if (!response.ok) {
      const data = await response.json();
      const authData = {
        authenticated: false,
        reason: data.reason || 'Auth check failed',
      };
      
      // Cache negative result for shorter time
      authCache.set(cacheKey, { data: authData, timestamp: Date.now() });
      return authData;
    }

    const authData = await response.json();
      // Cache successful result
    authCache.set(cacheKey, { data: authData, timestamp: Date.now() });
    
    return authData;} catch (error) {
    console.error('Middleware - Error checking auth:', error);
    const authData = {
      authenticated: false,
      reason: 'Internal error',
    };
    
    // Cache error result
    authCache.set(cacheKey, { data: authData, timestamp: Date.now() });
    return authData;
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
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  
  // Saltar middleware en modo QA
  if (process.env.QA_MODE === 'true') {
    return NextResponse.next();
  }
  
  // ========== RUTAS COMPLETAMENTE PÚBLICAS ==========
  const publicPaths = [
    '/auth/login',
    '/auth/login-admin',
    '/auth/recuperar',
    '/auth/recuperar-admin',
    '/acceso-denegado',
    '/api/internal/auth',
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

  // ========== MANEJAR REQUESTS POST A LA RAÍZ ==========
  // Los POST a la raíz suelen ser de formularios o acciones, no navegación
  if (pathname === '/' && method === 'POST') {
    return NextResponse.next();
  }
  // ========== DETERMINAR SI NECESITA VALIDACIÓN DE TOKEN ==========
  const criticalPaths = [
    '/', // Ruta raíz siempre necesita validación
    '/admin',
    '/super-admin',
    '/mi-cuenta',
    '/mis-compras',
  ];
  const needsTokenValidation = criticalPaths.some((path) =>
    pathname === path || pathname.startsWith(path)
  );

  // ========== OBTENER DATOS DE AUTENTICACIÓN (UNA SOLA VEZ) ==========
  const authData = await getAuthData(request, needsTokenValidation);

  // ========== VERIFICAR AUTENTICACIÓN ==========
  if (!authData.authenticated) {
    await clearAuthCookies(request);
    
    const isAdminRoute =
      pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
    const loginUrl = isAdminRoute ? '/auth/login-admin' : '/auth/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  const userRole = authData.user?.role as UserRole;

  // ========== MANEJAR RUTA RAÍZ ==========
  if (pathname === '/') {
    // Redirigir según el rol
    switch (userRole) {
      case 'cliente':
        return NextResponse.next();
      case 'admin':
        return NextResponse.redirect(
          new URL('/admin/total-de-ventas', request.url)
        );
      case 'superadmin':
        return NextResponse.redirect(
          new URL('/super-admin/users', request.url)
        );
      default:
        return NextResponse.redirect(new URL('/auth/login', request.url));
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
  }
  // Rutas para CLIENTE únicamente - todas las rutas de la carpeta (private)
  else if (
    pathname.startsWith('/carro-de-compra') ||
    pathname.startsWith('/compra-exitosa') ||
    pathname.startsWith('/redirect') ||
    pathname.startsWith('/webpay') ||
    pathname.startsWith('/confirmacion-pago') ||
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
    /*
     * Match all request paths except for the ones starting with:
     * - api/internal (internal APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - workbox-* (workbox files)
     * - Files with extensions (images, fonts, etc.)
     */
    '/((?!api/internal|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|css|js|map|json)$).*)',
  ],
};
