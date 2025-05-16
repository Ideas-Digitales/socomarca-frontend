'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import useAuthStore from '@/stores/useAuthStore';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || !password) {
      setError('Por favor, completa todos los campos correctamente');
      return;
    }

    setIsLoading(true);
    setError('');

   try {
  const result = await login({ rut, password });

  if (result.success) {
    router.push('/');
  } else {
    // Esto asume que `result` tiene una estructura diferente si no es success
    const errorMessage =
      result.error ||
      'Error al iniciar sesión';

    setError(errorMessage);
  }
} catch (error: any) {
  // Si el error es una respuesta del servidor
  if (error?.response?.status === 422) {
    const data = error.response.data;
    const rutError = data?.errors?.rut?.[0];

    setError(rutError || data?.message || 'Las credenciales ingresadas no son válidas');
  } else {
    setError('Las credenciales ingresadas no son válidas');
  }

  console.error(error);
} finally {
  setIsLoading(false);
}

  };

  return (
    <AuthView title="Iniciar sesión" text="Ingresa tus datos a continuación">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="flex flex-col items-start gap-5 w-full">
          <div className="flex flex-col items-start gap-[9px] w-full">
            <label htmlFor="rut" className="text-[14px]">
              Rut
            </label>
            <RutInput
              id="rut"
              value={rut}
              onChange={setRut}
              onValidationChange={setIsValid}
              errorMessage="El RUT ingresado no es válido"
            />
          </div>
          <div className="flex flex-col items-start gap-[9px] w-full">
            <label htmlFor="password" className="text-[14px]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border bg-[#EBEFF7] border-[#EBEFF7] p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex px-[1px] justify-between items-center w-full mt-5">
          <button
            type="submit"
            disabled={!isValid || !password || isLoading}
            className="w-[174px] p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>
          <Link
            className="text-[12px] font-medium recover-link"
            href={'/recuperar'}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </AuthView>
  );
}
