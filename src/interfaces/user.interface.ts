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
