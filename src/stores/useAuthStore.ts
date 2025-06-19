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
  isLoading: boolean;
  isInitialized: boolean;
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
  setLoading: (loading: boolean) => void;
  initializeFromAuth: () => Promise<void>;
}

// Función para obtener datos de autenticación desde la API interna
const getAuthData = async () => {
  try {
    const response = await fetch('/api/internal/auth');
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching auth data:', error);
    return null;
  }
};

const useAuthStore = create<AuthStoreState>((set, get) => ({
  isLoggedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    rut: '',
    roles: [],
  },
  token: '',
  isLoading: false,
  isInitialized: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Nueva función para inicializar desde cookies/API
  initializeFromAuth: async () => {
    const authData = await getAuthData();

    if (authData && authData.authenticated && authData.user) {
      const { user } = authData;

      set({
        isLoggedIn: true,
        isInitialized: true,
        user: {
          id: user.id || 0,
          name: user.name || '',
          email: user.email || '',
          rut: user.rut || '',
          roles: user.roles || [user.role] || [],
        },
      });
    } else {
      set({
        isLoggedIn: false,
        isInitialized: true,
        user: { id: 0, name: '', email: '', rut: '', roles: [] },
        token: '',
      });
    }
  },

  login: async ({ rut, password, role }) => {
    set({ isLoading: true });

    try {
      const response = await fetchLogin(rut, password, role);

      if (!response.user) {
        set({ isLoading: false });
        return {
          success: false,
          error: response.error?.message || 'Credenciales inválidas',
        };
      }

      // Actualizar el estado del store
      set({
        isLoggedIn: true,
        isLoading: false,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          rut: response.user.rut,
          roles: response.user.roles,
        },
      });

      // Esperar un momento para que las cookies se establezcan
      await new Promise((resolve) => setTimeout(resolve, 100));

      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);

      set({
        isLoggedIn: false,
        isLoading: false,
        user: { id: 0, name: '', email: '', rut: '', roles: [] },
        token: '',
      });

      // Manejar errores específicos del servidor
      if (error?.response?.status === 422) {
        const err: any = new Error('Error de validación');
        err.response = error.response;
        throw err;
      }

      throw new Error(error.message || 'Error desconocido');
    }
  },

  // Función para cerrar sesión
  logout: () => {
    console.log('Logout called from store');
    set({
      isLoggedIn: false,
      user: { id: 0, name: '', email: '', rut: '', roles: [] },
      token: '',
      isLoading: false,
    });
  },

  // Función para obtener el rol del usuario
  getUserRole: () => {
    const { user } = get();
    console.log('getUserRole called from store', user);
    return user.roles && user.roles.length > 0 ? user.roles[0] : null;
  },
}));

export default useAuthStore;
