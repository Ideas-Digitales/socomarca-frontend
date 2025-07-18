export interface User {
  id: number;
  name: string;
  email: string;
  rut: string;
  roles: string[] | null;
  permissions: string[] | null;
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
  phone: string;
  rut: string;
  business_name: string;
  is_active: boolean;
  last_login: string | null;
  roles: string[];
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

// Interfaces para búsqueda de usuarios
export interface SearchFilter {
  field: string;
  operator: string;
  value: string | boolean | number;
}

export interface SearchUsersRequest {
  filters: SearchFilter[];
  roles: string[];
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
}

// Función auxiliar para transformar ApiUser a User para la tabla
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

  // Obtener el primer rol como perfil, o 'Sin rol' si no hay roles
  const profile = apiUser.roles && apiUser.roles.length > 0 
    ? apiUser.roles[0].charAt(0).toUpperCase() + apiUser.roles[0].slice(1)
    : 'Sin rol';

  return {
    id: apiUser.id,
    username: apiUser.email.split('@')[0], // Usar parte del email como username
    name: firstName,
    lastname: lastName,
    email: apiUser.email,
    profile: profile,
  };
}
