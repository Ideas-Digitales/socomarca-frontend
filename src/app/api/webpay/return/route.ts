import { NextRequest, NextResponse } from 'next/server';

/**
 * Receptor del retorno de Transbank Webpay Plus.
 *
 * Cubre ambos casos:
 * - GET: cuando Transbank incluye token_ws como query param en la URL
 * - POST: cuando Transbank envía token_ws en el body del formulario (caso Capacitor)
 *
 * Convierte cualquier variante en un redirect GET hacia /confirmacion-pago
 * con el token en la query string, compatible con el WebView de Capacitor
 * y con el navegador web de escritorio.
 */

function buildRedirectUrl(origin: string, token_ws: string | null, tbk_token: string | null): URL {
  if (token_ws) {
    return new URL(`/confirmacion-pago?token_ws=${encodeURIComponent(token_ws)}`, origin);
  }
  if (tbk_token) {
    return new URL(`/confirmacion-pago?TBK_TOKEN=${encodeURIComponent(tbk_token)}`, origin);
  }
  return new URL('/confirmacion-pago', origin);
}

// Transbank vía GET (flujo web estándar con token en query string)
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const token_ws = searchParams.get('token_ws');
  const tbk_token = searchParams.get('TBK_TOKEN');
  return NextResponse.redirect(buildRedirectUrl(origin, token_ws, tbk_token), { status: 302 });
}

// Transbank vía POST (flujo Capacitor / mobile con token en form body)
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const formData = await request.formData();
    const token_ws = formData.get('token_ws') as string | null;
    const tbk_token = formData.get('TBK_TOKEN') as string | null;
    return NextResponse.redirect(buildRedirectUrl(origin, token_ws, tbk_token), { status: 302 });
  } catch {
    // Si falla el parse del formData, redirigir sin token
    return NextResponse.redirect(new URL('/confirmacion-pago', origin), { status: 302 });
  }
}
