'use client';

import { LoginResult } from '@/interfaces/login.interface';
import { fetchLogin } from '@/services/actions/auth.actions';
import { create } from 'zustand';

interface AuthStoreState {
  isLoggedIn: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    rut: string;
  };
  token: string;
  login: ({
    rut,
    password,
  }: {
    rut: string;
    password: string;
  }) => Promise<LoginResult>;
  logout: () => void;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    rut: '',
  },
  token: '',
  login: async ({ rut, password }) => {
    try {
      const response = await fetchLogin(rut, password);

      set({
        isLoggedIn: true,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          rut: response.user.rut,
        },
        token: response.token,
      });

      return { success: true };
    } catch (error: any) {
      set({
        isLoggedIn: false,
        user: { id: '', name: '', email: '', rut: '' },
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
  logout: () =>
    set({
      isLoggedIn: false,
      user: { id: '', name: '', email: '', rut: '' },
      token: '',
    }),
}));

export default useAuthStore;
