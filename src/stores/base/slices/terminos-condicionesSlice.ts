import { StateCreator } from 'zustand';
import {
  fetchGetTermsAndConditions,
  fetchUpdateTermsAndConditions,
  TermsAndConditions,
} from '@/services/actions/terminos-condiciones.actions';
import { ApiResponse } from '../types';

export interface TerminosCondicionesState {
  // Data states
  termsAndConditions: TermsAndConditions | null;
  
  // Loading states
  isLoadingTerms: boolean;
  isUpdatingTerms: boolean;
  
  // Error states
  termsError: string | null;
  
  // Editor state
  hasUnsavedChanges: boolean;
  currentContent: string;
}

export interface TerminosCondicionesSlice extends TerminosCondicionesState {
  // Actions
  fetchTermsAndConditions: () => Promise<ApiResponse<TermsAndConditions>>;
  updateTermsAndConditions: (content: string) => Promise<ApiResponse<TermsAndConditions>>;
  
  // State management
  setCurrentContent: (content: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  clearTermsError: () => void;
  resetTermsState: () => void;
}

const initialTerminosCondicionesState: TerminosCondicionesState = {
  // Data states
  termsAndConditions: null,
  
  // Loading states
  isLoadingTerms: false,
  isUpdatingTerms: false,
  
  // Error states
  termsError: null,
  
  // Editor state
  hasUnsavedChanges: false,
  currentContent: '',
};

export const createTerminosCondicionesSlice: StateCreator<
  TerminosCondicionesSlice,
  [],
  [],
  TerminosCondicionesSlice
> = (set, get) => ({
  ...initialTerminosCondicionesState,

  // Fetch terms and conditions
  fetchTermsAndConditions: async () => {
    set({ isLoadingTerms: true, termsError: null });
    
    try {
      const result = await fetchGetTermsAndConditions();
      
      if (result.ok && result.data) {
        set({
          termsAndConditions: result.data,
          currentContent: result.data.content,
          hasUnsavedChanges: false,
          isLoadingTerms: false,
        });
        
        return {
          ok: true,
          data: result.data,
        };
      } else {
        set({ 
          isLoadingTerms: false,
          termsError: result.error || 'Error al cargar términos y condiciones',
        });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al cargar términos y condiciones',
          },
        };
      }
    } catch (error) {
      set({ 
        isLoadingTerms: false,
        termsError: error instanceof Error ? error.message : 'Error desconocido',
      });
      console.error('Error in fetchTermsAndConditions:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Update terms and conditions
  updateTermsAndConditions: async (content: string) => {
    set({ isUpdatingTerms: true, termsError: null });
    
    try {
      const result = await fetchUpdateTermsAndConditions(content);
      
      if (result.ok && result.data) {
        set({
          termsAndConditions: result.data,
          currentContent: result.data.content,
          hasUnsavedChanges: false,
          isUpdatingTerms: false,
        });
        
        return {
          ok: true,
          data: result.data,
        };
      } else {
        set({ 
          isUpdatingTerms: false,
          termsError: result.error || 'Error al actualizar términos y condiciones',
        });
        return {
          ok: false,
          error: {
            message: result.error || 'Error al actualizar términos y condiciones',
          },
        };
      }
    } catch (error) {
      set({ 
        isUpdatingTerms: false,
        termsError: error instanceof Error ? error.message : 'Error desconocido',
      });
      console.error('Error in updateTermsAndConditions:', error);
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
      };
    }
  },

  // Set current content
  setCurrentContent: (content: string) => {
    const { currentContent } = get();
    set({ 
      currentContent: content,
      hasUnsavedChanges: content !== currentContent,
    });
  },

  // Set has unsaved changes
  setHasUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges });
  },

  // Clear terms error
  clearTermsError: () => {
    set({ termsError: null });
  },

  // Reset terms state
  resetTermsState: () => {
    set(initialTerminosCondicionesState);
  },
});
