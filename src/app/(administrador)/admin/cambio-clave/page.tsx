'use client';

import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  generateStrongPassword,
  getPasswordStrengthColor,
  getPasswordStrengthLevel,
  validatePasswordStrength,
} from '@/stores/base/utils/passwordUtilities';
import { patchUserAction } from '@/services/actions/user.actions';
import useStore from '@/stores/base';

interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordErrors {
  newPassword?: string[];
  confirmPassword?: string;
}

export default function CambioClavePage() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useStore();

  // Validar formulario
  const validateForm = (): ChangePasswordErrors => {
    const newErrors: ChangePasswordErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = ['La nueva contraseña es requerida'];
    } else {
      const passwordValidation = validatePasswordStrength(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.errors;
      }
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Debe confirmar la nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    // Verificar que ambos campos tengan contenido
    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
      return false;
    }

    // Verificar que la contraseña cumpla con los requisitos de seguridad
    const passwordValidation = validatePasswordStrength(formData.newPassword);
    if (!passwordValidation.isValid) {
      return false;
    }

    return true;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (errors[field as keyof ChangePasswordErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ChangePasswordErrors];
        return newErrors;
      });
    }

    // Limpiar mensaje de éxito cuando el usuario empiece a escribir
    if (successMessage) {
      setSuccessMessage('');
    }

    // Validar en tiempo real para habilitar/deshabilitar el botón
    // Esto se hace automáticamente porque isFormValid() se ejecuta en cada render
  };

  // Generar contraseña
  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword({
      length: 16,
      excludeSimilar: true,
    });
    setFormData((prev) => ({ ...prev, newPassword: newPassword, confirmPassword: newPassword }));

    // Limpiar errores de contraseña
    if (errors.newPassword || errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.newPassword;
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const updateData = {
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      };

      const result = await patchUserAction(user.id, updateData);

      if (result.success) {
        setSuccessMessage('Contraseña actualizada exitosamente');
        setFormData({
          newPassword: '',
          confirmPassword: '',
        });
        setErrors({});
      } else {
        console.error('Error al cambiar contraseña:', result.error);
        setErrors({
          newPassword: ['Error al cambiar la contraseña.'],
        });
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setErrors({
        newPassword: ['Error inesperado al cambiar la contraseña.'],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener validación de contraseña para mostrar nivel
  const passwordValidation = formData.newPassword
    ? validatePasswordStrength(formData.newPassword)
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Cambio de Clave
          </h1>
          {successMessage && (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          )}
        </div>
        <p className="text-gray-600 text-sm">
          Actualiza tu contraseña para mantener la seguridad de tu cuenta.
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nueva contraseña */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="new-password">
              Nueva contraseña
            </label>
            
            {/* Botón generar contraseña */}
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="self-start text-xs px-4 py-2 rounded-md border border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors ease-in-out duration-300"
            >
              Generar contraseña segura
            </button>

            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 h-[40px] pr-10 transition-colors ${
                  errors.newPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'
                } focus:outline-none focus:ring-1`}
                placeholder="Ingrese la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {passwordValidation && (
              <div className="p-3 rounded-md border">
                <span
                  className={`${getPasswordStrengthColor(
                    passwordValidation.score
                  )} text-sm font-medium`}
                >
                  {getPasswordStrengthLevel(passwordValidation.score)}
                </span>
              </div>
            )}

            {errors.newPassword && (
              <div className="flex flex-col gap-1">
                {errors.newPassword.map((error, index) => (
                  <span key={index} className="text-red-500 text-xs">
                    {error}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="confirm-password">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 h-[40px] pr-10 transition-colors ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'
                } focus:outline-none focus:ring-1`}
                placeholder="Confirme la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
                isFormValid() && !isSubmitting
                  ? 'bg-lime-500 hover:bg-lime-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 