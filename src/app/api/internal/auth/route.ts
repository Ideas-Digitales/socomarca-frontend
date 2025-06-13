// app/api/internal/auth/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Leer todas las cookies de autenticación
    const token = cookieStore.get('token')?.value;
    const role = cookieStore.get('role')?.value;
    const userId = cookieStore.get('userId')?.value;

    console.log('API Internal Auth - Cookies found:', {
      hasToken: !!token,
      role,
      userId,
      tokenLength: token?.length,
    });

    // Si no hay datos de autenticación
    if (!token || !role) {
      return NextResponse.json(
        {
          authenticated: false,
          reason: 'Missing auth data',
        },
        { status: 401 }
      );
    }

    // Validar el token con el backend si es necesario
    const validateToken =
      request.nextUrl.searchParams.get('validate') === 'true';

    if (validateToken) {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/auth/check-token`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json',
            },
            signal: AbortSignal.timeout(3000),
          }
        );


        if (!response.ok) {
          return NextResponse.json(
            {
              authenticated: false,
              reason: 'Invalid token',
            },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('API Internal Auth - Token validation error:', error);
        return NextResponse.json(
          {
            authenticated: false,
            reason: 'Token validation error',
          },
          { status: 500 }
        );
      }
    }

    // Retornar datos de autenticación
    return NextResponse.json({
      authenticated: true,
      user: {
        role,
        userId,
      },
    });
  } catch (error) {
    console.error('API Internal Auth - Error:', error);
    return NextResponse.json(
      {
        authenticated: false,
        reason: 'Internal error',
      },
      { status: 500 }
    );
  }
}

// POST para limpiar cookies cuando sea necesario
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'clear') {
      const response = NextResponse.json({ success: true });

      // Limpiar todas las cookies de autenticación
      response.cookies.delete('token');
      response.cookies.delete('role');
      response.cookies.delete('userId');

      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Internal Auth - POST Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
