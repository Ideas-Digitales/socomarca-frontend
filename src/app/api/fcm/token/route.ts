import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface FCMTokenRequest {
  fcm_token: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies();
    const authToken = cookieStore.get('token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'No autorizado: Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const body: FCMTokenRequest = await request.json();

    // Validar que se proporcione el token FCM
    if (!body.fcm_token || typeof body.fcm_token !== 'string') {
      return NextResponse.json(
        { error: 'El campo fcm_token es requerido y debe ser una cadena válida' },
        { status: 400 }
      );
    }

    // Validar formato básico del token FCM (Firebase tokens son largos)
    if (body.fcm_token.length < 100) {
      return NextResponse.json(
        { error: 'El token FCM parece ser inválido (muy corto)' },
        { status: 400 }
      );
    }

    // Aquí se haría la llamada al backend real
    // Por ahora, simulamos el éxito y loggeamos la información
    console.log('Token FCM recibido para actualizar:', {
      fcm_token: body.fcm_token,
      timestamp: new Date().toISOString(),
      user_auth_token: authToken.substring(0, 20) + '...' // Solo mostrar parte del token por seguridad
    });

    // Simular respuesta exitosa del backend
    return NextResponse.json(
      { 
        success: true, 
        message: 'Token FCM actualizado correctamente',
        data: {
          fcm_token: body.fcm_token,
          updated_at: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error procesando actualización de token FCM:', error);
    
    // Verificar si es un error de JSON parsing
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Formato JSON inválido' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies();
    const authToken = cookieStore.get('token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'No autorizado: Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // Simular obtención del token FCM actual del usuario
    // En una implementación real, esto vendría de la base de datos
    console.log('Solicitando token FCM actual para usuario con token:', authToken.substring(0, 20) + '...');

    return NextResponse.json(
      { 
        success: true,
        fcm_token: null, // En una implementación real, esto vendría de la BD
        message: 'Token FCM obtenido (simulado)'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error obteniendo token FCM:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
