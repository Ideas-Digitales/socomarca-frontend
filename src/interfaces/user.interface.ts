export interface User {
  id: number;
  name: string;
  email: string;
  rut: string;
  roles: string[] | null;
}

export interface LoginResponse {
  user: User | null;
  error?: {
    message: string;
    status: number;
  };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  rut: string;
  business_name: string;
  is_active: boolean;
  last_login: string | null;
  password_changed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface UsersApiResponse {
  data: ApiUser[];
  meta: ApiMeta;
}

// Función auxiliar para transformar ApiUser a User
export function transformApiUserToUser(apiUser: ApiUser): {
  id: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  profile: string;
} {
  // Separar el nombre completo en nombre y apellido
  const nameParts = apiUser.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: apiUser.id,
    username: apiUser.email.split('@')[0], // Usar parte del email como username
    name: firstName,
    lastname: lastName,
    email: apiUser.email,
    profile: apiUser.is_active ? 'Administrador' : 'Inactivo', // Mapear según tu lógica
  };
}
