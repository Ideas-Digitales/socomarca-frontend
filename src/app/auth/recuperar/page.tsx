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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOnRecuperarContraseña = () => {
    setError('');
    setIsSuccess(false);
    startTransition(async () => {
      console.log('Enviando correo de recuperación para RUT:', rut);
      const res = await sendRecoveryEmail(rut);
      console.log('Respuesta del servidor:', res);
      if (res.success) {
        console.log('Mostrando mensaje de éxito');
        setIsSuccess(true);
      } else {
        console.log('Error:', res.message);
        setError(res.message);
      }
    });
  };

  return (
    <AuthView
      title={isSuccess ? "¡Recuperación exitosa!" : "Recuperar constraseña"}
      text={isSuccess ? "" : "Ingresa tus datos a continuación"}
    >
      {!isSuccess ? (
        <>
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
            <Link href="/auth/login" className="text-lime-500 cursor-pointer">
              Iniciar sesión
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-6 h-full">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-center text-gray-600 leading-6"> Revisa tu bandeja de entrada 
            </p>
          </div>
          <Link
            href="/auth/login"
            className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium text-center"
          >
            Volver al login
          </Link>
        </>
      )}
    </AuthView>
  );
}
