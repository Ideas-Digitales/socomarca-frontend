'use client';

import AuthView from '@/app/components/auth/AuthView';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <AuthView showLogo={false}>
      <div className="flex flex-col items-center gap-6 h-full">
        <EnvelopeIcon width={64} height={64} color="#84CC16" />
        <h1 className="text-4xl font-bold leading-10">¡Recuperación exitosa!</h1>
        <p className="leading-6 text-center">
          Te hemos enviado un correo electrónico con las instrucciones <br /> para 
          restablecer tu contraseña. Revisa tu bandeja de entrada <br /> y sigue 
          los pasos indicados en el correo. Si no lo encuentras, <br /> revisa 
          también la carpeta de correos no deseados.
        </p>
      </div>
      <Link
        href={'/auth/login'}
        className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium text-center"
      >
        Volver al login
      </Link>
    </AuthView>
  );
}
