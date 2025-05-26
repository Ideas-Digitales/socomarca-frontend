export interface User {
  id: number;
  name: string;
  email: string;
  rut: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
