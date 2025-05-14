export interface User {
  id: string;
  name: string;
  email: string;
  rut: string;
}

export interface LoginResponse {
  user: User;
  jwt: string;
}
