import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/utils/getEnv';

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'BACKEND_URL no configurada' },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'No autorizado: token no encontrado' },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Cuerpo JSON inválido' },
      { status: 400 }
    );
  }

  const pathValue = typeof body === 'object' && body !== null && 'path' in body
    ? body.path
    : null;
  const path = typeof pathValue === 'string' ? pathValue.trim() : '';

  if (!path) {
    return NextResponse.json(
      { message: 'El path S3 es requerido' },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/products/images/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
      cache: 'no-store',
    });

    const text = await backendResponse.text();
    const payload = text ? safeJsonParse(text) : {};

    return NextResponse.json(payload, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Error al despachar sincronización de imágenes',
      },
      { status: 502 }
    );
  }
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
