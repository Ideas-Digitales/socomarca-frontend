import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/utils/getEnv';

export async function POST() {
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

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/products/images/presigned-upload-url`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
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
            : 'Error al generar URL prefirmada',
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
