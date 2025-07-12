import { StateCreator } from 'zustand';
import { fetchGetCustomerMessage } from '@/services/actions/system.actions';

export interface CustomerMessageSlice {
  // Estado
  customerMessage: {
    header: {
      color: string;
      content: string;
    };
    banner: {
      desktop_image: string;
      mobile_image: string;
      enabled: boolean;
    };
    modal: {
      image: string;
      enabled: boolean;
    };
  } | null;
  isLoadingCustomerMessage: boolean;
  customerMessageError: string | null;

  // Acciones
  fetchCustomerMessage: () => Promise<void>;
  clearCustomerMessageError: () => void;
  resetCustomerMessageState: () => void;
}

export const createCustomerMessageSlice: StateCreator<
  any,
  [],
  [],
  CustomerMessageSlice
> = (set) => ({
  // Estado inicial
  customerMessage: null,
  isLoadingCustomerMessage: false,
  customerMessageError: null,

  // Acciones
  fetchCustomerMessage: async () => {
    try {
      set({ isLoadingCustomerMessage: true, customerMessageError: null });
      
      const response = await fetchGetCustomerMessage();
      
      if (response.ok && response.data) {
        set({
          customerMessage: response.data,
          isLoadingCustomerMessage: false,
        });
      } else {
        set({
          customerMessage: null,
          isLoadingCustomerMessage: false,
          customerMessageError: response.error || 'Error al cargar el mensaje del cliente',
        });
      }
    } catch (error) {
      console.error('Error fetching customer message:', error);
      set({
        customerMessage: null,
        isLoadingCustomerMessage: false,
        customerMessageError: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  clearCustomerMessageError: () => {
    set({ customerMessageError: null });
  },

  resetCustomerMessageState: () => {
    set({
      customerMessage: null,
      isLoadingCustomerMessage: false,
      customerMessageError: null,
    });
  },
}); 