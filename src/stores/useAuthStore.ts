import useMainStore from './base';

// Hook que emula la interfaz del useAuthStore original para mantener compatibilidad
export const useAuthStore = () => {
  const store = useMainStore();

  return {
    // Estados
    isLoggedIn: store.isLoggedIn,
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,

    // Acciones
    login: store.login,
    logout: store.logout,
    initializeFromAuth: store.initializeFromAuth,
    setLoading: store.setLoading,
    getUserRole: store.getUserRole,
    getUserPermissions: store.getUserPermissions,
    hasPermission: store.hasPermission,
  };
};

// Selectores optimizados para casos específicos
export const useAuthUser = () => useMainStore((state) => state.user);

export const useAuthStatus = () =>
  useMainStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
  }));

export const useAuthActions = () =>
  useMainStore((state) => ({
    login: state.login,
    logout: state.logout,
    initializeFromAuth: state.initializeFromAuth,
    setLoading: state.setLoading,
    getUserRole: state.getUserRole,
    getUserPermissions: state.getUserPermissions,
    hasPermission: state.hasPermission,
  }));

export default useAuthStore;
