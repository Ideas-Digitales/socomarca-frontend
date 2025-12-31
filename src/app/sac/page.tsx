import Link from 'next/link';

export default function SoporteAtencionClientePage() {
  const email = 'contacto@socomarca.cl';

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <div className="w-full flex max-w-3xl mx-auto">
        <div className="h-2 w-1/3 bg-[#267E00]"></div>
        <div className="h-2 w-2/3 bg-[#6CB409]"></div>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Soporte y Atención al Cliente</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          En caso de requerir <strong>asistencia de carácter comercial</strong> o <strong>soporte técnico</strong>,
          le solicitamos contactarse a través del correo electrónico
          {' '}<a
            href={`mailto:${email}`}
            className="text-lime-600 font-semibold hover:text-lime-700 underline"
          >
            {email}
          </a>, donde nuestro equipo correspondiente atenderá su solicitud y le brindará el apoyo necesario a la brevedad posible.
        </p>
        <p className="text-gray-600">
          También puede volver al flujo de autenticación desde el siguiente enlace:
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
