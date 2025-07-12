import { StateCreator } from 'zustand';
import { fetchGetClientsList, fetchGetCustomersList, Customer } from '@/services/actions/clients.actions';
import { ClientDetail, ClientPaginationMeta, ClientsFilters } from '@/interfaces/client.interface';

export interface ClientsSlice {
  clientsList: ClientDetail[];
  clientsPagination: ClientPaginationMeta | null;
  isLoadingClients: boolean;
  clientsError: string | null;
  clientsFilters: ClientsFilters;
  clientsCurrentPage: number;
  
  // Nueva funcionalidad para customers
  customersList: Customer[];
  isLoadingCustomers: boolean;
  customersError: string | null;

  fetchClients: (
    start: string,
    end: string,
    per_page: number,
    page: number,
    total_min?: number,
    total_max?: number
  ) => Promise<void>;
  fetchCustomers: () => Promise<void>;
  setClientsFilters: (filters: ClientsFilters) => void;
  setClientsCurrentPage: (page: number) => void;
  resetClientsState: () => void;
}

export const createClientsSlice: StateCreator<ClientsSlice> = (set) => ({
  clientsList: [],
  clientsPagination: null,
  isLoadingClients: false,
  clientsError: null,
  clientsFilters: {},
  clientsCurrentPage: 1,
  
  // Nueva funcionalidad para customers
  customersList: [],
  isLoadingCustomers: false,
  customersError: null,

  fetchClients: async (
    start: string,
    end: string,
    per_page: number,
    page: number,
    total_min?: number,
    total_max?: number
  ) => {
    set({ isLoadingClients: true, clientsError: null });

    try {
      const result = await fetchGetClientsList(
        start,
        end,
        per_page,
        page,
        total_min,
        total_max
      );

      if (result.ok && result.data) {
        // Manejar ambos formatos de respuesta (detalle_tabla o table_detail)
        const clientsData = result.data.table_detail || result.data.detalle_tabla || [];
        
        set({
          clientsList: clientsData,
          clientsPagination: result.data.pagination,
          clientsCurrentPage: page,
          isLoadingClients: false,
        });
      } else {
        set({
          clientsError: result.error || 'Error al obtener la lista de clientes',
          isLoadingClients: false,
        });
      }
    } catch (error) {
      set({
        clientsError: error instanceof Error ? error.message : 'Error desconocido',
        isLoadingClients: false,
      });
    }
  },

  fetchCustomers: async () => {
    set({ isLoadingCustomers: true, customersError: null });

    try {
      const result = await fetchGetCustomersList();

      if (result.ok && result.data) {
        set({
          customersList: result.data,
          isLoadingCustomers: false,
        });
      } else {
        set({
          customersError: result.error || 'Error al obtener la lista de customers',
          isLoadingCustomers: false,
        });
      }
    } catch (error) {
      set({
        customersError: error instanceof Error ? error.message : 'Error desconocido',
        isLoadingCustomers: false,
      });
    }
  },

  setClientsFilters: (filters: ClientsFilters) => {
    set({ clientsFilters: filters });
  },

  setClientsCurrentPage: (page: number) => {
    set({ clientsCurrentPage: page });
  },

  resetClientsState: () => {
    set({
      clientsList: [],
      clientsPagination: null,
      isLoadingClients: false,
      clientsError: null,
      clientsFilters: {},
      clientsCurrentPage: 1,
      customersList: [],
      isLoadingCustomers: false,
      customersError: null,
    });
  },
});
