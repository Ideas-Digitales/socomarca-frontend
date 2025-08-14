'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { changePasswordAction } from '@/services/actions/auth.actions';
import { validatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthLevel } from '@/stores/base/utils/passwordUtilities';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { useAuthStore } from '@/stores/useAuthStore';

interface CambiarContraseñaFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export default function CambiarContraseñaSection() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<CambiarContraseñaFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<any>(null);

  const handleInputChange = (field: keyof CambiarContraseñaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }

    // Limpiar mensaje de éxito cuando el usuario empiece a escribir
    if (successMessage) {
      setSuccessMessage('');
    }

    // Validar contraseña nueva en tiempo real
    if (field === 'newPassword') {
      const validation = validatePasswordStrength(value);
      setPasswordValidation(validation);
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (passwordValidation && passwordValidation.score < 2) {
      newErrors.newPassword = 'La contraseña es muy débil';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    // Verificar que todos los campos tengan contenido
    if (!formData.currentPassword.trim() || !formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
      return false;
    }

    // Verificar que la contraseña cumpla con los requisitos de seguridad
    if (formData.newPassword.length < 8) {
      return false;
    }

    if (passwordValidation && passwordValidation.score < 2) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await changePasswordAction(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      if (result.success) {
        setSuccessMessage(result.message);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordValidation(null);
      } else {
        // Manejar errores específicos de la API
        if (result.error === 'TOKEN_NOT_FOUND') {
          setErrors({ general: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
        } else if (result.error === 'API_ERROR') {
          setErrors({ general: result.message });
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setErrors({ general: 'Ocurrió un error inesperado' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <KeyIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Cambiar Contraseña</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Mensaje de error general */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Contraseña actual */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${
                errors.currentPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showCurrentPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {passwordValidation && (
            <div className={`mt-2 p-2 rounded text-sm ${getPasswordStrengthColor(passwordValidation.score)}`}>
              {getPasswordStrengthLevel(passwordValidation.score)}
            </div>
          )}
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirmar nueva contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-2 px-4 rounded-lg focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition-colors ${
            isFormValid() && !isSubmitting
              ? 'bg-lime-600 hover:bg-lime-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Actualizando...</span>
            </div>
          ) : (
            'Cambiar contraseña'
          )}
        </button>
      </form>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Recomendaciones de seguridad:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Usa al menos 8 caracteres</li>
          <li>• Incluye mayúsculas, minúsculas y números</li>
          <li>• Agrega símbolos especiales para mayor seguridad</li>
          <li>• No uses información personal fácil de adivinar</li>
        </ul>
      </div>
    </div>
  );
} 