import { StateCreator } from 'zustand';
import { 
  fetchGetFAQ, 
  fetchSearchFAQ, 
  fetchCreateFAQ, 
  fetchUpdateFAQ, 
  fetchDeleteFAQ,
  FAQItem,
  FAQPaginationMeta,
  FAQPaginationLinks
} from '@/services/actions/faq.actions';

export interface FAQSlice {
  // Estado
  faqs: FAQItem[];
  currentFAQ: FAQItem | null;
  faqPaginationMeta: FAQPaginationMeta | null;
  faqPaginationLinks: FAQPaginationLinks | null;
  isLoadingFAQ: boolean;
  faqError: string | null;

  // Acciones
  fetchFAQs: (page?: number, perPage?: number) => Promise<void>;
  searchFAQs: (search: string, perPage?: number) => Promise<void>;
  createFAQ: (question: string, answer: string) => Promise<{ success: boolean; error?: string }>;
  updateFAQ: (id: number, question?: string, answer?: string) => Promise<{ success: boolean; error?: string }>;
  deleteFAQ: (id: number) => Promise<{ success: boolean; error?: string }>;
  setCurrentFAQ: (faq: FAQItem | null) => void;
  clearFAQError: () => void;
  resetFAQState: () => void;
}

export const createFAQSlice: StateCreator<FAQSlice> = (set, get) => ({
  // Estado inicial
  faqs: [],
  currentFAQ: null,
  faqPaginationMeta: null,
  faqPaginationLinks: null,
  isLoadingFAQ: false,
  faqError: null,

  // Obtener FAQs
  fetchFAQs: async (page = 1, perPage = 10) => {
    set({ isLoadingFAQ: true, faqError: null });
    
    const result = await fetchGetFAQ({ page, per_page: perPage });
    
    if (result.ok && result.data) {
      set({
        faqs: result.data.data,
        faqPaginationMeta: result.data.meta,
        faqPaginationLinks: result.data.links,
        isLoadingFAQ: false,
      });
    } else {
      set({
        faqError: result.error || 'Error al obtener FAQs',
        isLoadingFAQ: false,
      });
    }
  },

  // Buscar FAQs
  searchFAQs: async (search: string, perPage = 10) => {
    set({ isLoadingFAQ: true, faqError: null });
    
    const result = await fetchSearchFAQ({ search, per_page: perPage });
    
    if (result.ok && result.data) {
      set({
        faqs: result.data.data,
        faqPaginationMeta: result.data.meta,
        faqPaginationLinks: result.data.links,
        isLoadingFAQ: false,
      });
    } else {
      set({
        faqError: result.error || 'Error al buscar FAQs',
        isLoadingFAQ: false,
      });
    }
  },

  // Crear FAQ
  createFAQ: async (question: string, answer: string) => {
    set({ isLoadingFAQ: true, faqError: null });
    
    const result = await fetchCreateFAQ({ question, answer });
    
    if (result.ok && result.data) {
      // Actualizar la lista de FAQs
      const { faqs } = get();
      set({
        faqs: [...faqs, result.data.data],
        isLoadingFAQ: false,
      });
      
      return { success: true };
    } else {
      const errorMessage = result.error || 'Error al crear FAQ';
      set({
        faqError: errorMessage,
        isLoadingFAQ: false,
      });
      return { success: false, error: result.error || undefined };
    }
  },

  // Actualizar FAQ
  updateFAQ: async (id: number, question?: string, answer?: string) => {
    set({ isLoadingFAQ: true, faqError: null });
    
    const updateData: { question?: string; answer?: string } = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    
    const result = await fetchUpdateFAQ(id, updateData);
    
    if (result.ok && result.data) {
      // Actualizar la lista de FAQs
      const { faqs } = get();
      const updatedFAQs = faqs.map(faq => 
        faq.id === id ? result.data!.data : faq
      );
      
      set({
        faqs: updatedFAQs,
        isLoadingFAQ: false,
      });
      
      return { success: true };
    } else {
      const errorMessage = result.error || 'Error al actualizar FAQ';
      set({
        faqError: errorMessage,
        isLoadingFAQ: false,
      });
      return { success: false, error: result.error || undefined };
    }
  },

  // Eliminar FAQ
  deleteFAQ: async (id: number) => {
    set({ isLoadingFAQ: true, faqError: null });
    
    const result = await fetchDeleteFAQ({ id });
    
    if (result.ok) {
      // Actualizar la lista de FAQs
      const { faqs } = get();
      const updatedFAQs = faqs.filter(faq => faq.id !== id);
      
      set({
        faqs: updatedFAQs,
        isLoadingFAQ: false,
      });
      
      return { success: true };
    } else {
      const errorMessage = result.error || 'Error al eliminar FAQ';
      set({
        faqError: errorMessage,
        isLoadingFAQ: false,
      });
      return { success: false, error: result.error || undefined };
    }
  },

  // Establecer FAQ actual
  setCurrentFAQ: (faq: FAQItem | null) => {
    set({ currentFAQ: faq });
  },

  // Limpiar error
  clearFAQError: () => {
    set({ faqError: null });
  },

  // Resetear estado
  resetFAQState: () => {
    set({
      faqs: [],
      currentFAQ: null,
      faqPaginationMeta: null,
      faqPaginationLinks: null,
      isLoadingFAQ: false,
      faqError: null,
    });
  },
});
