'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RecuperarContraseñaPage() {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleOnRecuperarContraseña = () => {
    router.push('/check-email');
  };

  return (
    <AuthView
      title="Recuperar constraseña"
      text="Ingresa tus datos a continuación"
    >
      <div className="flex flex-col items-start gap-[9px] w-full">
        <label htmlFor="" className="font-[14px]">
          Rut
        </label>
        <RutInput
          value={rut}
          onChange={setRut}
          onValidationChange={setIsValid}
          errorMessage="El RUT ingresado no es válido"
        />
      </div>
      <button
        onClick={handleOnRecuperarContraseña}
        disabled={!isValid}
        className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium"
      >
        Recuperar contraseña
      </button>
      {/* Texto pequeño "Iniciar sesión" */}
      <div className="flex flex-col items-center gap-[10px] w-full"></div>
      <p className="text-[12px] font-medium">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-lime-500 cursor-pointer">
          Iniciar sesión
        </Link>
      </p>
    </AuthView>
  );
}
