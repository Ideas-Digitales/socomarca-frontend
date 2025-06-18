import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const validateToken = request.nextUrl.searchParams.get('validate') === 'true';
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const role = cookieStore.get('role')?.value;
    const userId = cookieStore.get('userId')?.value;
    const userData = cookieStore.get('userData')?.value;

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
    }    // Retornar datos de autenticación
    let userDetails = null;
    
    // Intentar parsear los datos del usuario desde la cookie
    if (userData) {
      try {
        userDetails = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        role,
        userId,
        ...userDetails,
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

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'clear') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('token');
      response.cookies.delete('role');
      response.cookies.delete('userId');
      response.cookies.delete('userData');

      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Internal Auth - POST Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
