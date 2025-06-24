// Utilidades para el store

export const createLoadingWrapper = <T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  setLoading: (loading: boolean) => void
) => {
  return async (...args: T): Promise<R> => {
    try {
      setLoading(true);
      const result = await asyncFn(...args);
      return result;
    } catch (error) {
      console.error('Error in async operation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
};

export const createErrorHandler = (context: string) => {
  return (error: any) => {
    console.error(`Error in ${context}:`, error);

    // Aquí se pueden agregar más lógicas de manejo de errores
    // como notificaciones, logging, etc.

    return {
      ok: false,
      error: {
        message: error.message || 'Error desconocido',
        status: error.status || 500,
      },
    };
  };
};

export const createSuccessResponse = <T>(data: T) => ({
  ok: true,
  data,
});

export const createErrorResponse = (message: string, status?: number) => ({
  ok: false,
  error: {
    message,
    status: status || 500,
  },
});

// Debounce utility para optimizar búsquedas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Utility para validar datos antes de actualizar el estado
export const validateAndSet = <T>(
  data: T,
  validator: (data: T) => boolean,
  setter: (data: T) => void,
  fallback?: T
) => {
  if (validator(data)) {
    setter(data);
  } else if (fallback !== undefined) {
    setter(fallback);
  } else {
    console.warn('Data validation failed, state not updated');
  }
};

// Utility para crear selectores optimizados
export const createSelector = <TState, TResult>(
  selector: (state: TState) => TResult
) => selector;

export const createShallowSelector = <TState, TResult>(
  selector: (state: TState) => TResult
) => selector;
