import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/utils/getEnv';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'No autorizado: token no encontrado' },
      { status: 401 }
    );
  }

  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
    return NextResponse.json(
      { message: 'Content-Type inválido, se esperaba multipart/form-data' },
      { status: 400 }
    );
  }

  if (!request.body) {
    return NextResponse.json(
      { message: 'No se recibió cuerpo en la petición' },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/products/images/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': contentType,
      },
      body: request.body,
      duplex: 'half',
    } as RequestInit & { duplex: 'half' });

    const text = await backendResponse.text();
    const payload = text ? safeJsonParse(text) : {};

    return NextResponse.json(payload, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Error al contactar el servicio de sincronización',
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
