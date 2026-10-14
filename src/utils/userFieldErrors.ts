import type { UserFieldErrors } from '@/services/actions/user.actions';

export interface UserFormFieldErrors {
  email?: string;
  firstName?: string;
  phone?: string;
  rut?: string;
  businessName?: string;
  userProfile?: string;
  password?: string[];
  passwordConfirmation?: string;
}

/** Traduce los errores 422 de /users a los campos de los formularios de administración */
export function mapUserFieldErrors(fieldErrors: UserFieldErrors): UserFormFieldErrors {
  const first = (key: string) => fieldErrors[key]?.[0];
  const mapped: UserFormFieldErrors = {
    email: first('email'),
    // El formulario arma `name` a partir de nombre y apellidos
    firstName: first('name'),
    phone: first('phone'),
    rut: first('rut'),
    businessName: first('business_name'),
    userProfile: first('roles') ?? first('roles.0'),
    password: fieldErrors.password,
    passwordConfirmation: first('password_confirmation'),
  };

  return Object.fromEntries(
    Object.entries(mapped).filter(([, value]) => value !== undefined)
  );
}
