import { StateCreator } from 'zustand';
import { AuthSlice, StoreState } from '../types';
import { fetchLogin } from '@/services/actions/auth.actions';

// Función para obtener datos de autenticación desde la API interna
const getAuthData = async (): Promise<any | null> => {
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

export const createAuthSlice: StateCreator<
  StoreState & AuthSlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  // Estados iniciales de autenticación
  isLoggedIn: false,
  user: {
    id: 0,
    name: '',
    email: '',
    rut: '',
    roles: [],
  },
  token: '',
  isInitialized: false,
  isLoading: false, // Agregado este estado faltante

  // Establecer estado de carga
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Inicializar desde cookies/API
  initializeFromAuth: async () => {
    try {
      const authData = await getAuthData();

      if (authData?.authenticated && authData?.user) {
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
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        isLoggedIn: false,
        isInitialized: true,
        user: { id: 0, name: '', email: '', rut: '', roles: [] },
        token: '',
      });
    }
  },

  // Función de login
  login: async ({
    rut,
    password,
    role,
  }: {
    rut: string;
    password: string;
    role?: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await fetchLogin(rut, password, role);

      if (!response.user) {
        set({ isLoading: false });
        return {
          success: false,
          error: response.error?.message || 'Credenciales inválidas',
        };
      } // Actualizar el estado del store
      set({
        isLoggedIn: true,
        // No seteamos isLoading: false aquí para mantener el loader hasta la redirección
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          rut: response.user.rut,
          roles: response.user.roles || [], // Manejar posible null
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
    return user.roles && user.roles.length > 0 ? user.roles[0] : null;
  },
});
