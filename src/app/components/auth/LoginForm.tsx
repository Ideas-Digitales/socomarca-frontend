'use client';

import AuthView from '@/app/components/auth/AuthView';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import useAuthStore from '@/stores/useAuthStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  role?: 'admin' | 'client';
  recoveryLink: string;
  onSuccessRedirect?: string;
  useWindowLocation?: boolean;
}

export default function LoginForm({
  title = 'Iniciar sesión',
  subtitle = 'Ingresa tus datos a continuación',
  role,
  recoveryLink,
  onSuccessRedirect = '/',
  useWindowLocation = false,
}: LoginFormProps) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, setLoading } = useAuthStore();
  const router = useRouter();

  // Usar el estado de loading local si no es admin, o el del store si es admin
  const currentIsLoading = role === 'admin' ? isLoading : isLoading;
  const [localLoading, setLocalLoading] = useState(false);
  const finalIsLoading = role === 'admin' ? localLoading : currentIsLoading;

  // Limpiar el estado de loading cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (role === 'admin') {
        setLocalLoading(false);
      } else {
        setLoading(false);
      }
    };
  }, [role, setLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || !password) {
      setError('Por favor, completa todos los campos correctamente');
      return;
    }

    if (role === 'admin') {
      setLocalLoading(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const loginData = role ? { rut, password, role } : { rut, password };
      const result = await login(loginData);

      if (result.success) {
        // Determinar la redirección basada en el rol
        let redirectPath = onSuccessRedirect;
        
        // Si es admin o está en la página de login-admin, redirigir a la página de administración
        if (role === 'admin' || recoveryLink.includes('recuperar-admin')) {
          redirectPath = '/admin/total-de-ventas';
        } else if (result.user && result.user.roles) {
          // Verificar el rol del usuario desde la respuesta del login
          const userRoles = result.user.roles;
          
          if (userRoles.includes('admin') || userRoles.includes('superadmin')) {
            redirectPath = '/admin/total-de-ventas';
          }
        }

        // Mantener el loading activo durante la redirección
        if (useWindowLocation) {
          // Usar window.location para forzar recarga (útil para middleware)
          window.location.href = redirectPath;
        } else {
          router.push(redirectPath);
        }
      } else {
        const errorMessage = result.error || 'Error al iniciar sesión';
        setError(errorMessage);

        if (role === 'admin') {
          setLocalLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Error en handleSubmit:', error);

      // Si el error es una respuesta del servidor
      if (error?.response?.status === 422) {
        const data = error.response.data;
        const rutError = data?.errors?.rut?.[0];

        setError(
          rutError ||
            data?.message ||
            'Las credenciales ingresadas no son válidas'
        );
      } else {
        setError(error.message || 'Las credenciales ingresadas no son válidas');
      }

      if (role === 'admin') {
        setLocalLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <AuthView title={title} text={subtitle}>
      <form onSubmit={handleSubmit} className="w-full relative">
        {/* Loading Overlay */}
        {finalIsLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner />
              <span className="text-sm text-gray-600">
                {role === 'admin'
                  ? 'Validando credenciales...'
                  : 'Iniciando sesión...'}
              </span>
            </div>
          </div>
        )}

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
              disabled={finalIsLoading}
            />
          </div>
          <div className="flex flex-col items-start gap-[9px] w-full">
            <label htmlFor="password" className="text-[14px]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={finalIsLoading}
              className="w-full border bg-[#EBEFF7] border-[#EBEFF7] p-[10px] h-[40px] focus:outline-none focus:ring-1 focus:ring-[#EBEFF7] focus:border-[#EBEFF7] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 px-[1px] justify-between items-center w-full mt-5">
          <button
            data-cy="btn-login"
            type="submit"
            disabled={!isValid || !password || finalIsLoading}
            className="w-[174px] p-3 rounded-[6px] bg-lime-500 hover:bg-lime-600 transition-colors ease-in-out cursor-pointer text-white text-[12px] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {finalIsLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            )}
            {finalIsLoading
              ? role === 'admin'
                ? 'Cargando...'
                : 'Iniciando sesión...'
              : 'Ingresar'}
          </button>
          {!finalIsLoading && (
            <Link
              className="text-[12px] font-medium recover-link"
              href={recoveryLink}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </div>
      </form>
    </AuthView>
  );
}
