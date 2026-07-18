'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import {
  sendRecoveryEmail,
  updateCredentialsAction,
} from '@/services/actions/auth.actions';

type Step = 'rut' | 'add-email' | 'check-inbox';

const LOGIN_LINK = '/auth/login-admin';

export default function RecuperarContraseñaAdminPage() {
  const [step, setStep] = useState<Step>('rut');
  const [rut, setRut] = useState('');
  const [isRutValid, setIsRutValid] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Provisional token: only exists in memory for the lifetime of this page.
  // Never persisted (no cookie/localStorage) — it's scoped to a single
  // PATCH /auth/credentials call and is worthless for anything else.
  const [provisionalToken, setProvisionalToken] = useState('');

  // The backend's success message includes the masked destination email
  // (e.g. "...enviada a j***@example.com"), so it's shown as-is instead of
  // a generic client-side string.
  const [inboxMessage, setInboxMessage] = useState('');

  const handleRestore = () => {
    setError('');
    startTransition(async () => {
      const res = await sendRecoveryEmail(rut);

      if (!res.success) {
        setError(res.message);
        return;
      }

      if (res.provisionalToken) {
        setProvisionalToken(res.provisionalToken);
        setStep('add-email');
      } else {
        setInboxMessage(res.message);
        setStep('check-inbox');
      }
    });
  };

  const handleAddEmail = () => {
    setError('');
    startTransition(async () => {
      const res = await updateCredentialsAction(provisionalToken, email);

      if (!res.success) {
        setError(res.fieldErrors?.email?.[0] || res.message);
        return;
      }

      setProvisionalToken('');
      setInboxMessage(res.message);
      setStep('check-inbox');
    });
  };

  if (step === 'add-email') {
    return (
      <AuthView
        title="Agrega tu correo"
        text="No encontramos un correo asociado a tu cuenta. Ingresa uno para recibir tu contraseña temporal."
      >
        <div className="flex flex-col items-start gap-[9px] w-full">
          <label htmlFor="email" className="font-[14px]">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full border bg-[#EBEFF7] border-[#EBEFF7] p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7] disabled:opacity-50"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          onClick={handleAddEmail}
          disabled={!email || isPending}
          className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium disabled:opacity-50"
        >
          {isPending ? 'Enviando...' : 'Continuar'}
        </button>
      </AuthView>
    );
  }

  if (step === 'check-inbox') {
    return (
      <AuthView title="¡Recuperación exitosa!" text="">
        <div className="flex flex-col items-center gap-6 h-full">
          <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-lime-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-center text-gray-600 leading-6">
            {inboxMessage ||
              'Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.'}
          </p>
        </div>
        <Link
          href={LOGIN_LINK}
          className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium text-center"
        >
          Volver al login
        </Link>
      </AuthView>
    );
  }

  return (
    <AuthView title="Recuperar constraseña" text="Ingresa tus datos a continuación">
      <div className="flex flex-col items-start gap-[9px] w-full">
        <label htmlFor="" className="font-[14px]">
          Rut
        </label>
        <RutInput
          value={rut}
          onChange={setRut}
          onValidationChange={setIsRutValid}
          errorMessage="El RUT ingresado no es válido"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={handleRestore}
        disabled={!isRutValid || isPending}
        className="w-full p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium disabled:opacity-50"
      >
        {isPending ? 'Enviando...' : 'Recuperar contraseña'}
      </button>

      <div className="flex flex-col items-center gap-[10px] w-full"></div>
      <p className="text-[12px] font-medium">
        ¿Ya tienes cuenta?{' '}
        <Link href={LOGIN_LINK} className="text-lime-500 cursor-pointer">
          Iniciar sesión
        </Link>
      </p>
    </AuthView>
  );
}
