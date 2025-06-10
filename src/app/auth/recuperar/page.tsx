'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { sendRecoveryEmail } from '@/services/actions/auth.actions';

export default function RecuperarContraseñaPage() {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleOnRecuperarContraseña = () => {
    setError('');
    startTransition(async () => {
      const res = await sendRecoveryEmail(rut);
      if (res.success) {
        router.push('/check-email');
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <AuthView
      title="Recuperar constraseña"
      text="Ingresa tus datos a continuación"
    >
      <div className="flex flex-col items-start gap-[9px] w-full">
        <label htmlFor="" className="font-[14px]">Rut</label>
        <RutInput
          value={rut}
          onChange={setRut}
          onValidationChange={setIsValid}
          errorMessage="El RUT ingresado no es válido"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={handleOnRecuperarContraseña}
        disabled={!isValid || isPending}
        className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium disabled:opacity-50"
      >
        {isPending ? 'Enviando...' : 'Recuperar contraseña'}
      </button>

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
