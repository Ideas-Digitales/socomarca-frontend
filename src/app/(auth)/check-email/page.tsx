'use client';

import AuthView from '@/app/components/auth/AuthView';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <AuthView showLogo={false}>
      <div className="flex flex-col items-center gap-6 h-full">
        <EnvelopeIcon width={64} height={64} color="#84CC16" />
        <h1 className="text-4xl font-bold leading-10">Revisa tu email</h1>
        <p className="leading-6 text-center">
          Te hemos enviado un correo electrónico con el enlace <br /> para que
          puedas crear una nueva contraseña. Si no te <br /> ha llegado en unos
          minutos, revisa la carpeta de los <br /> correos no deseados.
        </p>
      </div>
      <Link
        href={'/login'}
        className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium text-center"
      >
        Volver al inicio
      </Link>
    </AuthView>
  );
}
