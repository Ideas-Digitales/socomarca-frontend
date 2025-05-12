'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [rut, setRut] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <AuthView title="Iniciar sesión" text="Ingresa tus datos a continuación">
      {/* Inputs */}
      <div className="flex flex-col items-start gap-5 w-full">
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
        <div className="flex flex-col items-start gap-[9px] w-full">
          <label htmlFor="" className="font-[14px]">
            Password
          </label>
          <input
            type="password"
            className="w-full border bg-[#EBEFF7] border-[#EBEFF7] p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7]"
          />
        </div>
      </div>
      {/* Buttons */}
      <div className="flex px-[1px] justify-between items-center w-full">
        <button
          disabled={!isValid}
          className="w-[174px] p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium"
        >
          Ingresar
        </button>
        <Link
          className="text-[12px] font-medium recover-link"
          href={'/recuperar'}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </AuthView>
  );
}
