'use client';

import AuthView from '@/app/components/auth/AuthView';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { sendRecoveryEmail } from '@/services/actions/auth.actions';

type Step = 'email' | 'check-inbox';

const LOGIN_LINK = '/auth/login';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperarContraseñaPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // The backend answers the same masked-email message whether or not the
  // account exists, so it's shown as-is instead of a client-side string.
  const [inboxMessage, setInboxMessage] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const handleRestore = () => {
    setError('');
    startTransition(async () => {
      const res = await sendRecoveryEmail(email);

      if (!res.success) {
        setError(res.message);
        return;
      }

      setInboxMessage(res.message);
      setStep('check-inbox');
    });
  };

  if (step === 'check-inbox') {
    return (
      <AuthView title="Revisa tu correo" text="">
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
            {inboxMessage || 'Revisa tu bandeja de entrada'}
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
        <label htmlFor="email" className="font-[14px]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="w-full border bg-[#EBEFF7] border-[#EBEFF7] p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7] disabled:opacity-50"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={handleRestore}
        disabled={!isEmailValid || isPending}
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
