'use client';

import { LoginResult } from '@/interfaces/login.interface';
import { fetchLogin } from '@/services/actions/auth.actions';
import { create } from 'zustand';

interface AuthStoreState {
  isLoggedIn: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    rut: string;
    roles: string[] | null;
  };
  token: string;
  login: ({
    rut,
    password,
    role,
  }: {
    rut: string;
    password: string;
    role?: string;
  }) => Promise<LoginResult>;
  logout: () => void;
  getUserRole: () => string | null;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    rut: '',
    roles: [],
  },
  token: '',
  login: async ({ rut, password, role }) => {
    try {
      const response = await fetchLogin(rut, password, role);

      if (!response.user) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      set({
        isLoggedIn: true,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          rut: response.user.rut,
          roles: response.user.roles,
        },
      });

      return { success: true };
    } catch (error: any) {
      set({
        isLoggedIn: false,
        user: { id: 0, name: '', email: '', rut: '', roles: [] },
        token: '',
      });

      // Lanzamos el error para que el catch externo lo capture
      if (error?.response?.status === 422) {
        const err: any = new Error('Error de validación');
        err.response = error.response;
        throw err;
      }

      throw new Error(error.message || 'Error desconocido');
    }
  },
  // Función para cerrar sesión
  logout: () =>
    set({
      isLoggedIn: false,
      user: { id: 0, name: '', email: '', rut: '', roles: [] },
      token: '',
    }),
  // Función para obtener el rol del usuario
  getUserRole: () => {
    const user: AuthStoreState['user'] = useAuthStore.getState().user;
    return user.roles && user.roles.length > 0 ? user.roles[0] : null;
  },
}));

export default useAuthStore;
