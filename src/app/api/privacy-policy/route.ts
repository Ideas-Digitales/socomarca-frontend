import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Here you would typically save to your database
    // For now, we'll just return a success response
    // You can replace this with your actual database logic
    
    // Example: await prisma.privacyPolicy.upsert({
    //   where: { id: 1 },
    //   update: { content },
    //   create: { content }
    // });

    console.log('Privacy policy content to save:', content);

    return NextResponse.json(
      { message: 'Privacy policy updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener el token de las cookies si existe
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Si hay token, agregarlo a los headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Hacer la petición al backend
    const response = await fetch(`${BACKEND_URL}/privacy-policy`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { content: data.content || 'No hay contenido disponible en este momento.' },
        { status: 200 }
      );
    } else {
      console.error('Backend returned error:', response.status);
      return NextResponse.json(
        { content: 'No hay contenido disponible en este momento.' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error fetching privacy policy from backend:', error);
    return NextResponse.json(
      { content: 'No hay contenido disponible en este momento.' },
      { status: 200 }
    );
  }
} 