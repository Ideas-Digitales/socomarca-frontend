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
}

const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    rut: '',
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
        },
      });

      return { success: true };
    } catch (error: any) {
      set({
        isLoggedIn: false,
        user: { id: 0, name: '', email: '', rut: '' },
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
      user: { id: 0, name: '', email: '', rut: '' },
      token: '',
    }),
}));

export default useAuthStore;
