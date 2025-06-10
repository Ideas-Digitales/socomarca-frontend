'use client';
import {
  generateStrongPassword,
  getPasswordStrengthColor,
  getPasswordStrengthLevel,
  validatePasswordStrength,
} from '@/stores/base/utils/passwordUtilities';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

// Interfaces para el formulario
interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  userProfile: 'colaborador' | 'editor' | '';
  password: string;
  sendNotification: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  userProfile?: string;
  password?: string[];
}

export default function CreateUser() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    secondLastName: '',
    userProfile: '',
    password: '',
    sendNotification: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar formulario
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El primer apellido es requerido';
    }

    if (!formData.secondLastName.trim()) {
      newErrors.secondLastName = 'El segundo apellido es requerido';
    }

    if (!formData.userProfile) {
      newErrors.userProfile = 'Debe seleccionar un perfil de usuario';
    }

    if (!formData.password.trim()) {
      newErrors.password = ['La contraseña es requerida'];
    } else {
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors;
      }
    }

    return newErrors;
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    const currentErrors = validateForm();
    return Object.keys(currentErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // Generar contraseña
  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword({
      length: 16,
      excludeSimilar: true,
    });
    setFormData((prev) => ({ ...prev, password: newPassword }));

    // Limpiar errores de contraseña
    if (errors.password) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  // Enviar formulario (mock)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    // Simular llamada al backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Usuario creado:', formData);
      alert('Usuario creado exitosamente!');

      // Limpiar formulario
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        secondLastName: '',
        userProfile: '',
        password: '',
        sendNotification: false,
      });
      setErrors({});
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener validación de contraseña para mostrar nivel
  const passwordValidation = formData.password
    ? validatePasswordStrength(formData.password)
    : null;

  return (
    <form className="px-4 md:px-[40px] max-w-7xl" onSubmit={handleSubmit}>
      <div className="flex flex-col p-2 md:p-4 gap-4 md:gap-6">
        <p className="text-sm">Agregar los datos para crear un nuevo usuario</p>
        <div className="gap-4 md:gap-[27px] flex flex-col">
          {/* Primera fila - Username y Email */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-[34px]">
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-[15px]" htmlFor="username-create-user">
                Nombre de usuario
              </label>
              <input
                id="username-create-user"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 h-[40px] w-full"
              />
              {errors.username && (
                <span className="text-red-500 text-xs">{errors.username}</span>
              )}
            </div>
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-[15px]" htmlFor="email-create-user">
                Correo electrónico
              </label>
              <input
                id="email-create-user"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 h-[40px] w-full"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Segunda fila - Nombres y apellidos */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-[34px]">
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-[15px]" htmlFor="firstname-create-user">
                Nombre
              </label>
              <input
                id="firstname-create-user"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 h-[40px] w-full"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs">{errors.firstName}</span>
              )}
            </div>
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-[15px]" htmlFor="lastname-create-user">
                Primer apellido
              </label>
              <input
                id="lastname-create-user"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 h-[40px] w-full"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">{errors.lastName}</span>
              )}
            </div>
            <div className="flex flex-col gap-[10px] w-full">
              <label
                className="text-[15px]"
                htmlFor="secondlastname-create-user"
              >
                Segundo apellido
              </label>
              <input
                id="secondlastname-create-user"
                type="text"
                value={formData.secondLastName}
                onChange={(e) =>
                  handleInputChange('secondLastName', e.target.value)
                }
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 h-[40px] w-full"
              />
              {errors.secondLastName && (
                <span className="text-red-500 text-xs">
                  {errors.secondLastName}
                </span>
              )}
            </div>
          </div>

          {/* Perfil de usuario */}
          <div className="flex flex-col md:flex-row md:gap-6 md:items-center gap-3">
            <p className="text-xs">Perfil de usuario</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-[48px] md:flex-1-0-0">
              <div className="flex gap-2 items-center">
                <label className="text-xs" htmlFor="colaborador-create-user">
                  Colaborador
                </label>
                <input
                  className="text-xs"
                  type="radio"
                  name="userProfile"
                  id="colaborador-create-user"
                  checked={formData.userProfile === 'colaborador'}
                  onChange={() =>
                    handleInputChange('userProfile', 'colaborador')
                  }
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-xs" htmlFor="editor-create-user">
                  Editor
                </label>
                <input
                  className="text-xs"
                  type="radio"
                  name="userProfile"
                  id="editor-create-user"
                  checked={formData.userProfile === 'editor'}
                  onChange={() => handleInputChange('userProfile', 'editor')}
                />
              </div>
            </div>
            {errors.userProfile && (
              <span className="text-red-500 text-xs">{errors.userProfile}</span>
            )}
          </div>

          {/* Botón generar contraseña */}
          <div className="flex flex-col md:flex-row md:gap-6 md:items-center gap-3">
            <p className="text-xs">Contraseña</p>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="text-xs px-6 md:px-12 py-3 rounded-md border-slate-400 border-[1px] border-solid text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors ease-in-out duration-300 w-fit"
            >
              Generar contraseña
            </button>
          </div>

          {/* Campo de contraseña y botón mostrar/ocultar */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex flex-col gap-[6px] w-full md:w-auto">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-[#EBEFF7] text-[15px] px-2 py-1 w-full md:min-w-[250px] h-[40px]"
              />
              <span
                className={`${
                  passwordValidation
                    ? getPasswordStrengthColor(passwordValidation.score)
                    : 'bg-gray-100'
                } p-[10px] h-[40px] text-center text-sm`}
              >
                {passwordValidation
                  ? getPasswordStrengthLevel(passwordValidation.score)
                  : 'Sin contraseña'}
              </span>
              {errors.password && (
                <div className="flex flex-col gap-1">
                  {errors.password.map((error, index) => (
                    <span key={index} className="text-red-500 text-xs">
                      {error}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-6 md:px-12 py-3 text-xs flex gap-3 justify-center items-center border-solid rounded-md border-[1px] border-slate-400 text-slate-400 hover:bg-slate-100 transition-colors ease-in-out duration-300 h-[48px] cursor-pointer w-fit"
            >
              {showPassword ? (
                <>
                  <EyeSlashIcon width={24} height={24} />
                  Ocultar
                </>
              ) : (
                <>
                  <EyeIcon width={24} height={24} />
                  Mostrar
                </>
              )}
            </button>
          </div>

          {/* Enviar notificación */}
          <div className="flex flex-col md:flex-row md:gap-6 md:items-center gap-3">
            <p className="text-xs">Enviar aviso al usuario</p>
            <div className="flex gap-2 items-start md:items-center">
              <input
                className="text-xs mt-1 md:mt-0"
                type="checkbox"
                id="enviar-aviso-user"
                checked={formData.sendNotification}
                onChange={(e) =>
                  handleInputChange('sendNotification', e.target.checked)
                }
              />
              <label htmlFor="enviar-aviso-user" className="text-xs">
                Envía al nuevo usuario un correo electrónico con información
                sobre su cuenta.
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
            <button
              type="button"
              className="text-xs font-medium w-full md:min-w-[120px] md:w-auto px-6 md:px-12 py-3 border-[1px] border-slate-400 text-slate-400 rounded-md hover:bg-slate-100 transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`text-xs text-white font-medium w-full md:min-w-[120px] md:w-auto px-6 md:px-12 py-3 rounded-md transition-colors duration-300 ease-in-out ${
                isFormValid() && !isSubmitting
                  ? 'bg-lime-500 hover:bg-lime-600 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
