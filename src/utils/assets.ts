const s3Base = process.env.NEXT_PUBLIC_S3_BASE_URL;

/**
 * Resuelve la URL de un asset servido desde S3 (`NEXT_PUBLIC_S3_BASE_URL`).
 * Si la variable está vacía, usa el fallback local bajo /public.
 */
const asset = (s3Path: string, localFallback: string) =>
  s3Base ? `${s3Base}${s3Path}` : localFallback;

/** Imagen de apoyo por defecto (antes logo_plant): fallback de productos, carro vacío, etc. */
export const DEFAULT_IMAGE = asset('/assets/default.png', '/assets/global/logo_plant.png');
