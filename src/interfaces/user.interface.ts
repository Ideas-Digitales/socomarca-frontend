export interface User {
  id: number;
  name: string;
  email: string;
  rut: string;
}

export interface LoginResponse {
  user: User | null;
  error?: {
    message: string;
    status: number;
  };
}
